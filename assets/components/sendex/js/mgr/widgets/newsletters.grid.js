// Задаем переменную в объекте Sendex, которая содержит функцию
Sendex.grid.Newsletters = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'sendex-grid-newsletters';
    }
    Ext.applyIf(config, {
        url: Sendex.config.connector_url,
        fields: this.getFields(config),
        columns: this.getColumns(config),
        tbar: this.getTopBar(config),
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/newsletter/getlist'
        },
        listeners: {
            rowDblClick: function (grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateNewsletter(grid, e, row);
            }
        },
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            autoFill: true,
            showPreview: true,
            scrollOffset: 0,
            getRowClass: function (rec) {
                return !rec.data.active
                    ? 'sendex-grid-row-disabled'
                    : '';
            }
        },
        paging: true,
        remoteSort: true,
        autoHeight: true,
    });
    Sendex.grid.Newsletters.superclass.constructor.call(this, config);

    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
};
Ext.extend(Sendex.grid.Newsletters, MODx.grid.Grid, {
    windows: {},

    getMenu: function (grid, rowIndex) {
        var ids = this._getSelectedIds();

        var row = grid.getStore().getAt(rowIndex);
        var menu = Sendex.utils.getMenu(row.data['actions'], this, ids);

        this.addContextMenuNewsletter(menu);
    },

	renderBoolean: function(val,cell,row) {
	    return val == '' || val == 0
            ? '<span style="color:red">' + _('no') + '<span>'
            : '<span style="color:green">' + _('yes') + '<span>';
    },

    renderImage: function(val,cell,row) {
        return val != ''
            ? '<img src="' + val + '" alt="" height="50" />'
            : '';
    },

    createNewsletter: function (btn, e) {
        var w = MODx.load({
            xtype: 'sendex-newsletter-window-create',
            id: Ext.id(),
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        w.reset();
        w.setValues({active: true});
        w.show(e.target);
    },

    updateNewsletter: function (btn, e, row) {
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        }
        else if (!this.menu.record) {
            return false;
        }
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/newsletter/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = MODx.load({
                            xtype: 'sendex-newsletter-window-update',
                            id: Ext.id(),
                            record: r,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                }
                            }
                        });
                        w.reset();
                        w.setValues(r.object);
                        w.show(e.target);
                    }, scope: this
                }
            }
        });
    },

    removeNewsletter: function () {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.msg.confirm({
            title: ids.length > 1
                ? _('sendex_newsletters_remove')
                : _('sendex_newsletter_remove'),
            text: ids.length > 1
                ? _('sendex_newsletters_remove_confirm')
                : _('sendex_newsletter_remove_confirm'),
            url: this.config.url,
            params: {
                action: 'mgr/newsletter/remove',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        return true;
    },

    disableNewsletter: function () {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/newsletter/disable',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        })
    },

    enableNewsletter: function () {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/newsletter/enable',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        })
    },

    getFields: function () {
        return ['id','name','description','active','template','image','email_subject','email_from','email_from_name','email_reply', 'actions'];
    },

    getColumns: function () {
        return [{
            header: _('sendex_newsletter_id'),
            dataIndex: 'id',
            width: 50
        },{
            header: _('sendex_newsletter_name'),
            dataIndex: 'name',
            width: 100
        },{
            header: _('sendex_newsletter_active'),
            dataIndex: 'active',
            width: 75,
            renderer: this.renderBoolean
        },{
            header: _('sendex_newsletter_template'),
            dataIndex: 'template',
            width: 75
        },{
            header: _('sendex_newsletter_email_subject'),
            dataIndex: 'email_subject',
            width: 100
        },{
            header: _('sendex_newsletter_email_from'),
            dataIndex: 'email_from',
            width: 100
        },{
            header: _('sendex_newsletter_image'),
            dataIndex: 'image',
            width: 75,
            renderer: this.renderImage
        },{
			header: _('sendex_grid_actions'),
			dataIndex: 'actions',
			renderer: Sendex.utils.renderActions,
			sortable: false,
			width: 100,
			id: 'actions'
		}];
    },

    getTopBar: function () {
        return [{
            text: '<i class="icon icon-plus"></i>&nbsp;' + _('sendex_btn_create'),
            handler: this.createNewsletter,
            scope: this
        }, '->', {
            xtype: 'sendex-field-search',
            width: 250,
            listeners: {
                search: {
                    fn: function (field) {
                        this._doSearch(field);
                    }, scope: this
                },
                clear: {
                    fn: function (field) {
                        field.setValue('');
                        this._clearSearch();
                    }, scope: this
                },
            }
        }];
    },

    onClick: function (e) {
        var elem = e.getTarget();
        if (elem.nodeName == 'BUTTON') {
            var row = this.getSelectionModel().getSelected();
            if (typeof(row) != 'undefined') {
                var action = elem.getAttribute('action');
                if (action == 'showMenu') {
                    var ri = this.getStore().find('id', row.id);
                    return this._showMenu(this, ri, e);
                }
                else if (typeof this[action] === 'function') {
                    this.menu.record = row.data;
                    return this[action](this, e);
                }
            }
        }
        return this.processEvent('click', e);
    },

    _getSelectedIds: function () {
        var ids = [];
        var selected = this.getSelectionModel().getSelections();

        for (var i in selected) {
            if (!selected.hasOwnProperty(i)) {
                continue;
            }
            ids.push(selected[i]['id']);
        }

        return ids;
    },

    _doSearch: function (tf) {
        this.getStore().baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
    },

    _clearSearch: function () {
        this.getStore().baseParams.query = '';
        this.getBottomToolbar().changePage(1);
    },
});
Ext.reg('sendex-grid-newsletters',Sendex.grid.Newsletters);

Sendex.grid.NewsletterSubscribers = function(config) {
	config = config || {};
	Ext.applyIf(config,{
		id: 'sendex-grid-newsletter-subscribers'
		,url: Sendex.config.connector_url
		,baseParams: {
			action: 'mgr/newsletter/subscriber/getlist'
			,newsletter_id: config.record.id
		}
		,fields: ['id','username','email']
		,autoHeight: true
		,paging: true
		,remoteSort: true
		,columns: [
			{header: _('sendex_subscriber_id'),dataIndex: 'id',width: 50}
			,{header: _('sendex_subscriber_username'),dataIndex: 'username',width: 100}
			,{header: _('sendex_subscriber_fullname'),dataIndex: 'fullname',width: 100}
			,{header: _('sendex_subscriber_email'),dataIndex: 'email',width: 100}
		]
		,tbar: [{
			xtype: 'sendex-combo-user'
			// Имя поля
			, name: 'user_id'
			, hiddenName: 'user_id'
			// Ширина - 50%
			, width: '50%'
			, listeners: {
				// При выборе позиции нужно запустить метод addSubscriber таблицы
				select: {fn: this.addSubscriber, scope: this}
			}
		}]
	});
	Sendex.grid.NewsletterSubscribers.superclass.constructor.call(this,config);
};
Ext.extend(Sendex.grid.NewsletterSubscribers,MODx.grid.Grid, {

	getMenu: function() {
		var m = [];
		m.push({
			text: _('sendex_subscriber_remove')
			,handler: this.removeSubscriber
		});
		this.addContextMenuItem(m);
	},


	// onClick: function(e) {
	// 	var elem = e.getTarget();
	// 	if (elem.nodeName == 'BUTTON') {
	// 		var row = this.getSelectionModel().getSelected();
	// 		if (typeof(row) != 'undefined') {
	// 			var type = elem.getAttribute('type');
	// 			if (type == 'menu') {
	// 				var ri = this.getStore().find('id', row.id);
	// 				return this._showMenu(this, ri, e);
	// 			}
	// 			else {
	// 				this.menu.record = row.data;
	// 				return this[type](this, e);
	// 			}
	// 		}
	// 	}
	// 	return this.processEvent('click', e);
	// },

	addSubscriber: function(combo, user, e) {
		// Очищаем выбор в комбобоксе
		combo.reset();

		// Отправляем ajax запрос на сервер, в процессор добавления
		MODx.Ajax.request({
			url: Sendex.config.connector_url
			,params: {
				action: 'mgr/newsletter/subscriber/create'
				// И передаём ему id юзера
				,user_id: user.id
				,newsletter_id: this.config.record.id
			}
			,listeners: {
				// Если все хорошо - обновляем таблицу подписчиков
				success: {fn:function(r) {this.refresh();},scope:this}
	}
	});
	},

	// addSubscribers: function(combo, group, e) {
	// 	combo.reset();
	// 	Sendex.utils.onAjax(this.getEl());
	//
	// 	MODx.Ajax.request({
	// 		url: Sendex.config.connector_url
	// 		,params: {
	// 			action: 'mgr/newsletter/subscriber/add_group'
	// 			,group_id: group.id
	// 			,newsletter_id: this.config.record.id
	// 		}
	// 		,listeners: {
	// 			success: {fn:function(r) {this.refresh();},scope:this}
	// 		}
	// 	});
	// },

	removeSubscriber:function(btn,e) {
		MODx.msg.confirm({
			title: _('sendex_subscriber_remove')
			,text: _('sendex_subscriber_remove_confirm')
			,url: Sendex.config.connector_url
			,params: {
				action: 'mgr/newsletter/subscriber/remove'
				,id: this.menu.record.id
			}
			,listeners: {
				success: {fn:function(r) {this.refresh();},scope:this}
			}
		});
	},

	_getSelectedIds: function() {
		var ids = [];
		var selected = this.getSelectionModel().getSelections();

		for (var i in selected) {
			if (!selected.hasOwnProperty(i)) {continue;}
			ids.push(selected[i]['id']);
		}

		return ids;
	}

});
Ext.reg('sendex-grid-newsletter-subscribers',Sendex.grid.NewsletterSubscribers);