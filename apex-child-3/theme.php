<?php

/**
 * APEX Atelier — child theme of APEX for luxury fashion & apparel.
 * Ivory / ink / muted gold, Cormorant Garamond + Jost, centered-logo header, borderless 3:4 product
 * cards, full-bleed collection tiles and an editorial section on the start page.
 *
 * Only settings that differ from apex (or are new) are listed; all other apex settings stay in effect.
 */

declare(strict_types=1);

$aTheme = [
    'id'             => 'apex-child-3',
    'title'          => 'APEX Child 3 – Atelier (Luxury Fashion)',
    'description'    => 'APEX child theme for luxury fashion and apparel: ivory, ink and gold, editorial serif type, '
        . 'centered logo, borderless 3:4 product cards, collection tiles and an editorial story on the start page.',
    'thumbnail'      => 'apex-child-3.svg',
    'version'        => '1.0.0',
    'author'         => 'OXID eSales AG',
    'parentTheme'    => 'apex',
    'parentVersions' => ['3.0.0'],
    'settings'       => [
        [
            'group' => 'logo',
            'name'  => 'sLogoFile',
            'type'  => 'str',
            'value' => 'logo.svg',
        ],
        [
            'group' => 'logo',
            'name'  => 'sLogoWidth',
            'type'  => 'str',
            'value' => '220',
        ],
        [
            'group' => 'logo',
            'name'  => 'sLogoHeight',
            'type'  => 'str',
            'value' => '48',
        ],
        [
            'group' => 'favicons',
            'name'  => 'sThemeColor',
            'type'  => 'str',
            'value' => '#FAF8F5',
        ],
        [
            'group'    => 'startpage',
            'name'     => 'blAtelierShowEditorial',
            'type'     => 'bool',
            'value'    => 1,
            'position' => 45,
        ],
        [
            'group'    => 'startpage',
            'name'     => 'sAtelierEditorialImage',
            'type'     => 'str',
            'value'    => '',
            'position' => 46,
        ],
    ],
];
