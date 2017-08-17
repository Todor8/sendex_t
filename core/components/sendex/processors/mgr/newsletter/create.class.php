<?php

class sxNewsletterCreateProcessor extends modObjectCreateProcessor
{
    public $objectType = 'sxNewsletter';
    public $classKey = 'sxNewsletter';
    public $languageTopics = array('sendex');
    //public $permission = 'create';


    /**
     * @return bool
     */
    public function beforeSet()
    {
		$required = array('name', 'template','email_from','email_from_name');
		foreach ($required as $tmp) {
			if (!$this->getProperty($tmp)) {
				$this->addFieldError($tmp, $this->modx->lexicon('field_required'));
			}
		}

		$active = $this->getProperty('active');
		$this->setProperty('active', !empty($active) && $active != 'false');

        $name = trim($this->getProperty('name'));
        if (empty($name)) {
            $this->modx->error->addField('name', $this->modx->lexicon('sendex_newsletter_err_name'));
        } elseif ($this->modx->getCount($this->classKey, array('name' => $name))) {
            $this->modx->error->addField('name', $this->modx->lexicon('sendex_newsletter_err_ae'));
        }

        return parent::beforeSet();
    }

}

return 'sxNewsletterCreateProcessor';