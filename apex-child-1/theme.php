<?php

/**
 * APEX Redline — child theme of APEX for auto spare parts & accessories.
 * Red / black / white, condensed uppercase type, red category bar, vehicle finder on the start page.
 *
 * Only settings that differ from apex (or are new) are listed; all other apex settings stay in effect.
 */

declare(strict_types=1);

$aTheme = [
    'id'             => 'apex-child-1',
    'title'          => 'APEX Child 1 – Redline (Auto Parts)',
    'description'    => 'APEX child theme for auto spare parts and accessories: red, black and white, '
        . 'condensed uppercase headings, red category bar and a vehicle finder on the start page.',
    'thumbnail'      => 'apex-child-1.svg',
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
            'value' => '210',
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
            'value' => '#D7182A',
        ],
        [
            'group' => 'header',
            'name'  => 'sRedlineHotline',
            'type'  => 'str',
            'value' => '+49 761 000 000',
        ],
        [
            'group'    => 'startpage',
            'name'     => 'blRedlineShowVehicleFinder',
            'type'     => 'bool',
            'value'    => 1,
            'position' => 10,
        ],
        [
            'group'    => 'startpage',
            'name'     => 'aRedlineVehicleMakes',
            'type'     => 'arr',
            'value'    => [
                'Audi', 'BMW', 'Citroën', 'Dacia', 'Fiat', 'Ford', 'Hyundai', 'Kia', 'Mazda',
                'Mercedes-Benz', 'Opel', 'Peugeot', 'Porsche', 'Renault', 'Seat', 'Škoda',
                'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
            ],
            'position' => 11,
        ],
    ],
];
