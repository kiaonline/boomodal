# boomodal

Bootstrap dynamic modal

## Usage

Simple to use:

    var modal = new boomodal(
    {
        title:'Hello world!',
        message:'Its a dynamic modal.'
    });
    modal.on('ok',function(){
        console.log('ok clicked');
    });

OR

$(selector).boomodal(options);



    options: 
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

   

See examples:
http://dialogo.digital/public/projects/boomodal/example/

*** See an example into a example directory
### Versions

Version 1.0

    - link dialog
    - ajax load dialog
    - confirm dialog



### Prerequisites

This plugin require jQuery and bootstrap

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
