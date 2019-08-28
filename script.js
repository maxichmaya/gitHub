(function() {
    //do not touch this
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    );

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });
    ///////////////////////////////////////////////////////////////////////
    var username, password, userToSearch;
    // event.handler 1
    $(".submit-button").on("click", function() {
        username = $('input[name="username"]').val();
        password = $('input[name="password"]').val();
        userToSearch = $('input[name="user-to-search"]').val();
        //baseUrl koji nadjem u dokumnetaciji
        var baseUrl = "https://api.github.com";
        //Endpoint ---aksing sto tocno zelim od te web stranice od API
        // the specific user's reposotories
        var endPoint = "/users/" + userToSearch + "/repos";
        //ova :username nam kaze da zamjenimo s pravim username kojeg trazimo
        console.log("baseUrl + endPoint", baseUrl + endPoint);

        $.ajax({
            url: baseUrl + endPoint,
            //by defaul ajax ce upotrijebiti get metodu
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password)
            },
            success: function(data) {
                console.log("data: ", data);
                // step 3
                var myDataTemplate = Handlebars.templates.dataTemplate({
                    data: data
                });
                //  STEP 4
                $(".data-container").html(myDataTemplate);

                $(".dataShow").on("click", function(e) {
                    console.log(e.target);
                    username = $('input[name="username"]').val();
                    password = $('input[name="password"]').val();
                    dataShow = $(e.target).text();
                    var baseUrl = "https://api.github.com";
                    var endRep = "/repos/" + dataShow + "/commits";

                    $.ajax({
                        url: baseUrl + endRep,

                        headers: {
                            Authorization:
                                "Basic " + btoa(username + ":" + password)
                        },
                        success: function(data) {
                            console.log("data ", data);
                            data = data.slice(0, 9);
                            var myDataTemplate = Handlebars.templates.dataRep({
                                data: data
                            });

                            // console.log("myDataTemplate: ", myDataTemplate);
                            $(e.target).append(myDataTemplate);
                        }
                    });
                });
                //this only thing that we need from API is full_name and avatar_url
            } //closes success
        }); //closes ajax
    }); // closes click on event
})(); //invoking an iife
