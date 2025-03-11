<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Teste extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'teste';
    }
} 