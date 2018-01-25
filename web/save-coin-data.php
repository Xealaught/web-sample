<?php

$fp = fopen('coindata.json', 'w');
fwrite($fp, $_POST['data']);
fclose($fp);