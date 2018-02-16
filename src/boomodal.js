/** ==================================================
 * boomodal 1.0
 * Licensed GPLv3 for open source use
 * example:
 * $(selector).boomodal({options});
 ==================================================*/

(function ( $ ) {

    function processCallback(e, dialog, callback) {
        e.preventDefault();
        var preserveDialog = $.isFunction(callback) && callback(e) === false;
        if (!preserveDialog) dialog.modal("hide");
    }

    var templates = {
        dialog:
        "<div class='custom-modal modal' tabindex='-1' role='dialog'>" +
            "<div class='modal-dialog'>" +
            "<div class='modal-content'>" +
                "<div class='modal-body'><div class='modal-body-content'></div></div>" +
            "</div>" +
            "</div>" +
        "</div>",
        header:
        "<div class='modal-header'>" +
            "<h4 class='modal-title'></h4>" +
        "</div>",
        footer:
        "<div class='modal-footer'></div>",
        closeButton:
        "<button type='button' class='modal-close-button close'>&times;</button>",
        form:
        "<form class='modal-form'></form>",
        inputs: {
            text:
                "<input class='modal-input modal-input-text form-control' autocomplete=off type=text />",
            email:
                "<input class='modal-input modal-input-email form-control' autocomplete='off' type='email' />",
            select:
                "<select class='modal-input modal-input-select form-control'></select>",
            checkbox:
                "<div class='checkbox'><label><input class='modal-input modal-input-checkbox' type='checkbox' /></label></div>"
        }
    };

    
    var boomodal = function(){
        var args    = arguments;
        var options = args[0] || {};
        var el      = args[1] || null;
        
        
        options = $.extend( {}, $.fn.boomodal.options, options );
        
        options.backdrop = options.backdrop ? "static" : false;

        var modalId     = "dlg-modal-"  + parseInt(Math.random() * 9999);


        var dialog      = $(templates.dialog).clone();
        var body        = dialog.find(".modal-body");
        var buttons     = options.buttons;
        var buttonStr   = "";
        var callbacks   = {
                onEscape: options.onEscape
        };
        
        if(options.confirm && el){
            options.buttons.ok.label = options.confirmLabel;
            
            options.buttons.ok.callback = function(){
                if(options.submitForm){
                    el.closest("form").submit();
                }else{
                    if(options.post){
                        var form = $('<form method="post" class="hide" action="' + options.url + '"></form>');
                        $("body").append(form);
                        form.submit();
                    }else{
                        window.location = options.url;
                    }
                }
            };
            
        }

        if(buttons){
            var keyButtons = Object.keys(buttons);
            keyButtons.reverse();
            $(keyButtons).each(function(index,key){
                var button = buttons[key];
                if(!button.class) button.class = "btn-primary";
                if(!button.label) button.label = key;
                buttonStr += "<button data-modal-handler='" + key + "' type='button' class='btn " + button.class + "'>" + button.label + "</button>";
                callbacks[key] = button.callback;
            });
        }
        
        dialog.attr('id',modalId);
        dialog.bind('handleEvents',function(e,key){
            dialog.trigger(key,[this]);
        });

        if (options.className) {
            dialog.addClass(options.className);
        }
        if (options.animate === true) {
            dialog.addClass("fade");
        }
        
        if(options.ajax && options.confirm === false){
            body.find('.modal-body-content').load(options.url);
            options.message = false;
        }
        

        if (options.message) {
            body.find('.modal-body-content').html(options.message);
        }

        if (options.title) {
            body.before(templates.header);
        }
    
        if (options.closeButton) {
            var closeButton = $(templates.closeButton);
        
            if (options.title) {
                dialog.find(".modal-header").append(closeButton);
            } else {
                closeButton.css("margin-top", "-10px").prependTo(body);
            }
        }
    
        if (options.title) {
            dialog.find(".modal-title").html(options.title);
        }

        if (buttonStr.length) {
            body.after(templates.footer);
            dialog.find(".modal-footer").html(buttonStr);
          }
        
        
        
        //events

        dialog.bind('centerPosition',function(){
            if(options.center === false) return true;
            var modal   = $(this),
                dialog  = modal.find('.modal-dialog');
            dialog.css("marginTop", Math.max(0, (window.innerHeight - dialog.height()) / 2));
        }).trigger("centerPosition");

        $(window).on('resize', function() {
            dialog.trigger('centerPosition');
        });

        dialog.on('hidden.bs.modal',function(e){
            if (e.target === this) dialog.remove();
        }).on("shown.bs.modal", function() {
            dialog.find(".btn-primary:first").focus();
        }).on("escape.close.modal", function(e) {
            if (callbacks.onEscape) processCallback(e, dialog, callbacks.onEscape);
        }).on("click", ".modal-footer button", function(e) {
            var callbackKey = $(this).data("modal-handler");
            dialog.trigger('handleEvents',callbackKey);

            processCallback(e, dialog, callbacks[callbackKey]);
        }).on("click", ".modal-close-button", function(e) {
            processCallback(e, dialog, callbacks.onEscape);
        }).on("keyup", function(e) {
            if (e.which === 27) {
              dialog.trigger("escape.close.modal");
            }
        });

        $(options.target).append(dialog);

        dialog.modal({
            backdrop: options.backdrop,
            keyboard: false,
            show: false
        });
    
        if (options.show) {
            dialog.modal("show");
        }
       
        return dialog;
    };
    window.boomodal = boomodal;

    /**
     * @example 
     * $(section)
     * 
     * @param   {Object} [opcional]    Opcional
     * @returns {Number}
     */
    $.fn.boomodal = function(options) {
        
        $(this).each(function(){
            var $this = $(this);
            if($this.data('boomodal')) return this;
            
            var url = $this.attr('href') || $this.data('url');
            if(!url){
                console.error("booModal require link with href attribute or element with data-url attribute. Nothing here to do!");
                return true;
            }
            $this.data('triggerClick',false);

            $this.on('click',function(event,cancel){
                
                var link            = $(this);
                var data_options    = link.data();
                
                var options         = $.extend( {},data_options , options );
                options.url         = url;
                var bm              = new boomodal(options,link);

                link.data('boomodal',true);
                return false;
            });
            
            return $this;
        });
    };
    
    $.fn.boomodal.options = {
        target          : document.body,    //target to append modal
        backdrop        : true,             //show back drop
        animate         : true,             //animate modal 
        className       : null,             //add custom class name
        closeButton     : true,             //show close button
        show            : true,             //open visible
        center          : true,             //center of window
        ajax            : false,            //load ajax into modal
        confirm         : false,            //confirm
        submitForm      : false,            //submit form: require confirm
        confirmLabel    : "Confirm?",       //Confirm button label: require confirm
        buttons:{
            ok:{
                class:'btn-primary',
                label:'Ok'
            },
            cancel:{
                class:'btn-default',
                label:'Cancel'
            }
        }
    };
    
    
    $("a[data-modal]").boomodal();
    
    /* OKOKOK

   var modal = new boomodal(
       {
           title:'Hello world!',
           message:'Its a dynamic modal.'
    });
   modal.on('ok',function(){
        console.log('ok clicked');
   });
    */

}( jQuery ));