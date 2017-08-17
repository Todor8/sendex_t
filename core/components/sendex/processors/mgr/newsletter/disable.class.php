<?php

class sxNewsletterDisableProcessor extends modObjectProcessor
{
    public $objectType = 'sxNewsletter';
    public $classKey = 'sxNewsletter';
    public $languageTopics = array('sendex');
    //public $permission = 'save';


    /**
     * @return array|string
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $ids = $this->modx->fromJSON($this->getProperty('ids'));
        if (empty($ids)) {
            return $this->failure($this->modx->lexicon('sendex_newsletter_err_ns'));
        }

        foreach ($ids as $id) {
            /** @var sxNewsletter $object */
            if (!$object = $this->modx->getObject($this->classKey, $id)) {
                return $this->failure($this->modx->lexicon('sendex_newsletter_err_nf'));
            }

            $object->set('active', false);
            $object->save();
        }

        return $this->success();
    }

}

return 'sxNewsletterDisableProcessor';
