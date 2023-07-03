// function initialize(){
//   jQuery('.content').hide();
//   jQuery('#div1').show();
// }

// jQuery(function() {
//     jQuery('.card-img').click(function(){
//       jQuery('.content').hide();
//       jQuery('#div' + $(this).attr('target')).show();
//       console.log('target')
//     });
//   });

//   $(document).ready(function() {
//     var header = document.getElementById("images");
//     var btns = header.getElementsByClassName("card-img");
//     for (var i = 0; i < btns.length; i++) {
//         btns[i].addEventListener("click", function () {
//             var current = document.getElementsByClassName("active");
//             current[0].className = current[0].className.replace(" active", "");
//             this.className += " active";
//         });
//     };

//   })


  //validation

  // $(document).ready(function(){
  //   $("#registration").validate({
  //     // Specify validation rules
  //     rules: {
  //       dob: "required",
  //       gender: "required",
  //       email: {
  //         required: true,
  //         email: true
  //       },      
  //       phone: {
  //         required: true,
  //         digits: true,
  //         minlength: 10,
  //         maxlength: 10,
  //       },
  //       password: {
  //         required: true,
  //         minlength: 5,
  //       }
  //     },
  //     messages: {
  //       firstname: {
  //       required: "Please enter first name",
  //      },      
  //      lastname: {
  //       required: "Please enter last name",
  //      },     
  //      phone: {
  //       required: "Please enter phone number",
  //       digits: "Please enter valid phone number",
  //       minlength: "Phone number field accept only 10 digits",
  //       maxlength: "Phone number field accept only 10 digits",
  //      },     
  //      email: {
  //       required: "Please enter email address",
  //       email: "Please enter a valid email address.",
  //      },
  //     },
    
  //   });
  // });