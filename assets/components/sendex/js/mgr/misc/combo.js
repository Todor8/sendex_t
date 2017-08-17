Sendex.combo.Search = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        xtype: 'twintrigger',
        ctCls: 'x-field-search',
        allowBlank: true,
        msgTarget: 'under',
        emptyText: _('search'),
        name: 'query',
        triggerAction: 'all',
        clearBtnCls: 'x-field-search-clear',
        searchBtnCls: 'x-field-search-go',
        onTrigger1Click: this._triggerSearch,
        onTrigger2Click: this._triggerClear,
    });
    Sendex.combo.Search.superclass.constructor.call(this, config);
    this.on('render', function () {
        this.getEl().addKeyListener(Ext.EventObject.ENTER, function () {
            this._triggerSearch();
        }, this);
    });
    this.addEvents('clear', 'search');
};
Ext.extend(Sendex.combo.Search, Ext.form.TwinTriggerField, {

    initComponent: function () {
        Ext.form.TwinTriggerField.superclass.initComponent.call(this);
        this.triggerConfig = {
            tag: 'span',
            cls: 'x-field-search-btns',
            cn: [
                {tag: 'div', cls: 'x-form-trigger ' + this.searchBtnCls},
                {tag: 'div', cls: 'x-form-trigger ' + this.clearBtnCls}
            ]
        };
    },

    _triggerSearch: function () {
        this.fireEvent('search', this);
    },

    _triggerClear: function () {
        this.fireEvent('clear', this);
    },

});
Ext.reg('sendex-combo-search', Sendex.combo.Search);
Ext.reg('sendex-field-search', Sendex.combo.Search);


Sendex.combo.User = function(config) {
	config = config || {};
	Ext.applyIf(config,{
		name: 'user_id'
		,fieldLabel: _('sendex_subscriber')
		,hiddenName: config.name || 'user_id'
		,displayField: 'username'
		,valueField: 'id'
		,anchor: '99%'
		,fields: ['username','id','fullname']
		,pageSize: 20
		,url: MODx.modx23
			? MODx.config.connector_url
			: MODx.config.connectors_url + 'security/user.php'
		,editable: true
		,allowBlank: true
		,emptyText: _('sendex_select_user')
		,baseParams: {
			action: MODx.modx23
				? 'security/user/getlist'
				: 'getlist'
			,combo: 1
		}
		,tpl: new Ext.XTemplate(
			'<tpl for=".">\
				<div class="x-combo-list-item">\
					<sup>({id})</sup> <strong>{username}</strong><br/>{fullname}\
				</div>\
			</tpl>'
			,{compiled: true}
		)
	});
	Sendex.combo.User.superclass.constructor.call(this,config);
};
Ext.extend(Sendex.combo.User,MODx.combo.ComboBox);
Ext.reg('sendex-combo-user',Sendex.combo.User);


Sendex.combo.Newsletter = function(config) {
	config = config || {};
	Ext.applyIf(config,{
		name: 'user_id'
		,fieldLabel: _('sendex_newsletter')
		,hiddenName: config.name || 'user_id'
		,displayField: 'name'
		,valueField: 'id'
		,anchor: '99%'
		,fields: ['id','name']
		,pageSize: 20
		,url: Sendex.config.connector_url
		,editable: true
		,allowBlank: true
		,emptyText: _('sendex_select_newsletter')
		,baseParams: {
			action: 'mgr/newsletter/getlist'
			,combo: 1
		}
		,tpl: new Ext.XTemplate(''
			+'<tpl for="."><div class="sendex-list-item">'
			+'<span><small>({id})</small> {name}</span>'
			+'</div></tpl>',{
			compiled: true
		})
		,itemSelector: 'div.sendex-list-item'
	});
	Sendex.combo.Newsletter.superclass.constructor.call(this,config);
};
Ext.extend(Sendex.combo.Newsletter,MODx.combo.ComboBox);
Ext.reg('sendex-combo-newsletter',Sendex.combo.Newsletter);