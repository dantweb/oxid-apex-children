<?php

/**
 * Module template extensions for child themes.
 *
 * Twig modules extend shop templates per theme: views/twig/extensions/themes/<theme id>/... (plus "default").
 * The stock ShopTemplateChainAppender (oxid-esales/twig-component) looks only at the ACTIVE theme id, which is
 * the child theme id when a child theme is active. A module that ships extensions for "apex" therefore loses
 * them under every apex child theme (e.g. the one-page checkout's apex hooks), silently.
 *
 * This replacement searches the active theme, then its parent theme, then "default" — the same order the shop
 * uses for its own templates (child tpl/ before parent tpl/).
 *
 * Registered in var/configuration/configurable_services.yaml under the original service id.
 */

declare(strict_types=1);

namespace OxidEsales\ApexChildThemes\Twig;

use OxidEsales\Eshop\Core\Registry;
use OxidEsales\Twig\Resolver\DataObject\NamespacedDirectory;
use OxidEsales\Twig\Resolver\TemplateChain\DataObject\TemplateChain;
use OxidEsales\Twig\Resolver\TemplateChain\TemplateHandler\ChainAppenderInterface;
use OxidEsales\Twig\Resolver\TemplateChain\TemplateType\DataObject\ShopExtensionTemplateType;
use OxidEsales\Twig\Resolver\TemplateChain\TemplateType\DataObject\TemplateTypeInterface;
use OxidEsales\Twig\TwigContextInterface;

class ParentThemeAwareShopTemplateChainAppender implements ChainAppenderInterface
{
    private const FALLBACK_THEME_ID = 'default';

    public function __construct(
        private TwigContextInterface $twigContext,
        private ChainAppenderInterface $chainAppender,
    ) {
    }

    public function addToChain(
        TemplateChain $templateChain,
        TemplateTypeInterface $templateType,
        NamespacedDirectory $directory
    ): TemplateChain {
        foreach ($this->themeIdsByLoadPriority() as $themeId) {
            $countBefore = $templateChain->count();
            $extension = new ShopExtensionTemplateType($templateType->getName(), $directory->getNamespace(), $themeId);
            $templateChain = $this->chainAppender->addToChain($templateChain, $extension, $directory);
            if ($templateChain->count() > $countBefore) {
                break;
            }
        }

        return $templateChain;
    }

    /**
     * @return list<string> active theme, parent theme (when a child theme is active), "default"
     */
    private function themeIdsByLoadPriority(): array
    {
        $activeThemeId = $this->twigContext->getActiveThemeId();
        $parentThemeId = (string) Registry::getConfig()->getConfigParam('sTheme');

        return array_values(array_unique(array_filter([$activeThemeId, $parentThemeId, self::FALLBACK_THEME_ID])));
    }
}
