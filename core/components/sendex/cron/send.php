<?php
// Это для вызова из директории разработки
if (file_exists(dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php')) {
	require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
}
else {
	require_once dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))) . '/config.core.php';
}

// Получаем конфиг и вызываем MODX
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

// Добавляем модель
$modx->addPackage('sendex', MODX_CORE_PATH . 'components/sendex/model/');

// Выбираем 100 писем
$q = $modx->newQuery('sxQueue');
$q->limit($modx->getOption('sendex_queue_limit', null, 100, true));

// Отправляем
$queue = $modx->getCollection('sxQueue');
/** @var sxQueue $email */
foreach ($queue as $email) {
	$email->send();
}