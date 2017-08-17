<?php
/**
 * Add a list of Queues
 */
class sxQueueAddProcessor extends modProcessor {
	public $objectType = 'sxQueue';
	public $classKey = 'sxQueue';
	/** {inheritDoc} */
	public function process() {
		// Получаем newsletter_id
		if (!$id = $this->getProperty('newsletter_id')) {
			return $this->failure($this->modx->lexicon('sendex_newsletter_err_ns'));
		}
		elseif (!$newsletter = $this->modx->getObject('sxNewsletter', $id)) {
			return $this->failure($this->modx->lexicon('sendex_newsletter_err_nf'));
		}
		/** @var sxNewsletter $newsletter */
		// Запускаем нужный метод
		$result = $newsletter->addQueues();
		// Если в ответ приходит не true - показываем ошибку

		if ($result !== true) {
			return $this->failure($result);
		}
		else {
			return $this->success();
		}
	}
}
return 'sxQueueAddProcessor';