<?php

/**
 * The home manager controller for Sendex.
 *
 */
class SendexHomeManagerController extends modExtraManagerController
{
    /** @var Sendex $Sendex */
    public $Sendex;


    /**
     *
     */
    public function initialize()
    {
        $path = $this->modx->getOption('sendex_core_path', null,
                $this->modx->getOption('core_path') . 'components/sendex/') . 'model/sendex/';
        $this->Sendex = $this->modx->getService('sendex', 'Sendex', $path);
        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return array('sendex:default');
    }


    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }


    /**
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('sendex');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addCss($this->Sendex->config['cssUrl'] . 'mgr/main.css');
        $this->addCss($this->Sendex->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
        $this->addJavascript($this->Sendex->config['jsUrl'] . 'mgr/sendex.js');
        $this->addJavascript($this->Sendex->config['jsUrl'] . 'mgr/misc/utils.js');
        $this->addJavascript($this->Sendex->config['jsUrl'] . 'mgr/misc/combo.js');
        $this->addJavascript($this->Sendex->config['jsUrl'] . 'mgr/widgets/items.grid.js');
        $this->addJavascript($this->Sendex->config['jsUrl'] . 'mgr/widgets/items.windows.js');
        $this->addJavascript($this->Sendex->config['jsUrl'] . 'mgr/widgets/home.panel.js');
        $this->addJavascript($this->Sendex->config['jsUrl'] . 'mgr/sections/home.js');

        $this->addHtml('<script type="text/javascript">
        Sendex.config = ' . json_encode($this->Sendex->config) . ';
        Sendex.config.connector_url = "' . $this->Sendex->config['connectorUrl'] . '";
        Ext.onReady(function() {
            MODx.load({ xtype: "sendex-page-home"});
        });
        </script>
        ');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        return $this->Sendex->config['templatesPath'] . 'home.tpl';
    }
}