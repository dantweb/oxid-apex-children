<?php

/**
 * APEX Voltage — child theme of APEX for modern electronics shops.
 * Electric blue on cool grey, Inter + Space Grotesk, rounded cards, sticky header with pill search,
 * round category strip and a deals panel on the start page.
 *
 * Only settings that differ from apex are listed; all other apex settings stay in effect.
 */

declare(strict_types=1);

$aTheme = [
    'id'             => 'apex-child-2',
    'title'          => 'APEX Child 2 – Voltage (Electronics)',
    'description'    => 'APEX child theme for modern electronics shops: electric blue on cool grey, rounded cards, '
        . 'sticky header with pill search, category icon strip and a deals panel on the start page.',
    'thumbnail'      => 'apex-child-2.svg',
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
            'value' => '180',
        ],
        [
            'group' => 'logo',
            'name'  => 'sLogoHeight',
            'type'  => 'str',
            'value' => '40',
        ],
        [
            'group' => 'favicons',
            'name'  => 'sThemeColor',
            'type'  => 'str',
            'value' => '#2563EB',
        ],
    ],
];
