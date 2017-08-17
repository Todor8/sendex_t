Sendex.window.CreateNewsletter = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'sendex-newsletter-window-create';
    }
    Ext.applyIf(config, {
        title: _('sendex_newsletter_create'),
        width: 550,
        autoHeight: true,
        url: Sendex.config.connector_url,
        action: 'mgr/newsletter/create',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    Sendex.window.CreateNewsletter.superclass.constructor.call(this, config);
};
Ext.extend(Sendex.window.CreateNewsletter, MODx.Window, {

    getFields: function (config) {
        return [{
			xtype: 'textfield',
			fieldLabel: _('sendex_newsletter_name'),
			name: 'name',
			id: config.id + '-name',
			anchor: '99%'
		},{
			layout:'column'
			,border: false
			,anchor: '100%'
			,items: [{
				columnWidth: .5
				,layout: 'form'
				,defaults: { msgTarget: 'under' }
				,border:false
				,items: [{
					xtype: 'modx-combo-template',
					fieldLabel: _('sendex_newsletter_template'),
					name: 'template',
					id: config.id + '-template',
					anchor: '99%'
				},{
					xtype: 'textfield',
					fieldLabel: _('sendex_newsletter_email_subject'),
					name: 'email_subject',
					id: config.id + '-email_subject',
					anchor: '99%'
				},{
					xtype: 'textfield',
					fieldLabel: _('sendex_newsletter_email_reply'),
					name: 'email_reply',
					id: config.id + '-email_reply',
					anchor: '99%'
				},{
					xtype: 'combo-boolean',
					fieldLabel: _('sendex_newsletter_active'),
					name: 'active',
					hiddenName: 'active',
					id: config.id + '-active',
					anchor: '50%'}
				]
			},{
				columnWidth: .5
				,layout: 'form'
				,defaults: { msgTarget: 'under' }
				,border:false
				,items: [{
					xtype: 'textfield',
					fieldLabel: _('sendex_newsletter_email_from'),
					name: 'email_from',
					id: config.id + '-email_from',
					anchor: '99%'
				},{
					xtype: 'textfield',
					fieldLabel: _('sendex_newsletter_email_from_name'),
					name: 'email_from_name',
					id: config.id + '-email_from_name',
					anchor: '99%'
				},{
					xtype: 'modx-combo-browser',
					fieldLabel: _('sendex_newsletter_image'),
					name: 'image',
					id: config.id + '-image',
					anchor: '99%'}
				]
			}]
		},{
			xtype: 'textarea',
			fieldLabel: _('description'),
			name: 'description',
			id: config.id + '-description',
			height: 75,
			anchor: '99%'
		}];
    },

    loadDropZones: function () {
    }

});
Ext.reg('sendex-newsletter-window-create', Sendex.window.CreateNewsletter);


Sendex.window.UpdateNewsletter = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'sendex-newsletter-window-update';
    }
    Ext.applyIf(config, {
        title: _('sendex_newsletter_update'),
		height: 350,
		width: 600,
        autoHeight: true,
        url: Sendex.config.connector_url,
        action: 'mgr/newsletter/update',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    Sendex.window.UpdateNewsletter.superclass.constructor.call(this, config);
};
Ext.extend(Sendex.window.UpdateNewsletter, MODx.Window, {

    getFields: function (config) {
        return [{
			xtype: 'modx-tabs'// У нас здесь табы
			,deferredRender: false// Рендерим их сразу
			,border: true// Добавляем обводку
			,bodyStyle: 'padding:5px;'// И отступы для контекта внутри таба
			// Пошло перечисление табов
			,items: [{
				// Таб №1 - Подписка
				title: _('sendex_newsletter')
				// Как прятать при переключении - советую всегда использовать offset
				,hideMode: 'offsets'
				// Указываем, что содержимое таба - форма
				,layout: 'form'
				// Здесь уже не нужна обводка
				,border:false
				// Пошли поля формы
				,items: [
					// Обязательно скрытый input с id, чтобы процессор понял, что мы обновляем
					{xtype: 'hidden',name: 'id',id: config.id +'-id'},
					// Дальше все те же поля, что и в форме создания
					{xtype: 'textfield',fieldLabel: _('name'),name: 'name',id: config.id + '-name',anchor: '99%'},
					{layout:'column',border: false,anchor: '100%',
						items: [{
							columnWidth: .5,layout: 'form',defaults: { msgTarget: 'under' },border:false
								,items: [
									{xtype: 'modx-combo-template',fieldLabel: _('sendex_newsletter_template'),name: 'template',id: config.id + '-template',anchor: '99%'},
									{xtype: 'textfield',fieldLabel: _('sendex_newsletter_email_subject'),name: 'email_subject',id: config.id + '-email_subject',anchor: '99%'},
									{xtype: 'textfield',fieldLabel: _('sendex_newsletter_email_reply'),name: 'email_reply',id: config.id + '-email_reply',anchor: '99%'},
									{xtype: 'combo-boolean',fieldLabel: _('sendex_newsletter_active'),name: 'active',hiddenName: 'active',id: config.id + '-active',anchor: '50%'}
								]
							},{
							columnWidth: .5,layout: 'form',defaults: { msgTarget: 'under' },border:false
								,items: [
									{xtype: 'textfield',fieldLabel: _('sendex_newsletter_email_from'),name: 'email_from',id: config.id + '-email_from',anchor: '99%'},
									{xtype: 'textfield',fieldLabel: _('sendex_newsletter_email_from_name'),name: 'email_from_name',id: config.id + '-email_from_name',anchor: '99%'},
									{xtype: 'modx-combo-browser',fieldLabel: _('sendex_newsletter_image'),name: 'image',id: config.id + '-image',anchor: '99%'}
								]
							}
						]
					},
					{xtype: 'textarea',fieldLabel: _('sendex_sendmail_description'),name: 'description',id: config.id + '-description',height: 75,anchor: '99%'}
				]
			},{
				// Таб №2 - Пользователи
				title: _('sendex_subscribers')
				// Здесь должен быть xtype с таблицей подписчиков, пока комментируем
				,xtype: 'sendex-grid-newsletter-subscribers'
				//,xtype: 'displayfield'
				,record: config.record.object
			}]
		}];
    },

    loadDropZones: function () {
    }

});
Ext.reg('sendex-newsletter-window-update', Sendex.window.UpdateNewsletter);