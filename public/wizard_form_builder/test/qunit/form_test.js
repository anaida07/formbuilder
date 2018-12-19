module("Model: WizardFormBuilder.Models.Form")

asyncTest("findAll", function(){
	stop(2000);
	WizardFormBuilder.Models.Form.findAll({}, function(forms){
		ok(forms)
        ok(forms.length)
        ok(forms[0].name)
        ok(forms[0].description)
		start()
	});
	
})

asyncTest("create", function(){
	stop(2000);
	new WizardFormBuilder.Models.Form({name: "dry cleaning", description: "take to street corner"}).save(function(form){
		ok(form);
        ok(form.id);
        equals(form.name,"dry cleaning")
        form.destroy()
		start();
	})
})
asyncTest("update" , function(){
	stop();
	new WizardFormBuilder.Models.Form({name: "cook dinner", description: "chicken"}).
            save(function(form){
            	equals(form.description,"chicken");
        		form.update({description: "steak"},function(form){
        			equals(form.description,"steak");
        			form.destroy();
        			start()
        		})
            })

});
asyncTest("destroy", function(){
	stop(2000);
	new WizardFormBuilder.Models.Form({name: "mow grass", description: "use riding mower"}).
            destroy(function(form){
            	ok( true ,"Destroy called" )
            	start();
            })
})