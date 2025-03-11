<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Mask extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'mask';
    }
} 