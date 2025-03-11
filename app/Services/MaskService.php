<?php

namespace App\Services;

class MaskService
{
    public function apply($value, $mask)
    {
        $maskared = '';
        $k = 0;
        
        for($i = 0; $i <= strlen($mask)-1; $i++) {
            if($mask[$i] == '#') {
                if(isset($value[$k])) {
                    $maskared .= $value[$k++];
                }
            } else {
                if(isset($mask[$i])) {
                    $maskared .= $mask[$i];
                }
            }
        }
        
        return $maskared;
    }
} 