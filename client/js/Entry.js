var StarRating = require('react-star-rating');

function resize (file, maxWidth, maxHeight, fn) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
        var dataUrl = event.target.result;

        var image = new Image();
        image.src = dataUrl;
        image.onload = function () {
            var resizedDataUrl = resizeImage(image, maxWidth, maxHeight, 0.7);
            fn(resizedDataUrl);
        };
    };
}

function resizeImage(image, maxWidth, maxHeight, quality) {
    var canvas = document.createElement('canvas');

    var width = image.width;
    var height = image.height;

    if (width > height) {
        if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
}

var Entry = React.createClass({
   getInitialState: function () {
       return {};
   },

   componentDidMount: function(){
      var self = this;
      var input = document.getElementById('restaurant');
      var options = {
        types: ['establishment']
      };

      var autocomplete = new google.maps.places.Autocomplete(input, options);

      autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();

        console.log(place);
        self.setState({
         restaurant: place
        });
        console.log(self.state.restaurant);
      });
   },

   handleSubmit: function() {
      var store = {
         restaurant : this.state.restaurant.name,
         address    : this.state.restaurant.formatted_address,
         zip        : this.state.restaurant.address_components[5],
         phone      : this.state.restaurant.formatted_phone_number,
         rating     : this.state.restaurant.rating,
         dishName   : document.getElementById('dish').value,
         dishRating : document.getElementById('dishRating').value,
         dishPrice  : document.getElementById('dishPrice').value,
         imgUrl     : this.state.dataUrl
      };

       $.ajax({
           url: "/insertdish",
           type: "POST",
           data: store,
           success: function(data) {
               // do stuff
               console.log(data);
           }.bind(this),
           error: function(xhr, status, err) {
               // do stuff
               console.log(xhr, status, err);
           }.bind(this)
       });
       return false;
   },

   onChange: function (e) {
       var files = e.target.files;
       var self = this;
       var maxWidth = this.props.maxWidth;
       var maxHeight = this.props.maxHeight;
       resize(files[0], maxWidth, maxHeight, function (resizedDataUrl) {
           self.setState({ dataUrl: resizedDataUrl });
       });
   },

   render: function () {
      var style = {
        color: 'red',
        fontSize: 13
      };

       var image;

       var dataUrl = this.state.dataUrl;
       if (dataUrl) {
           image = <img src={dataUrl} />
       }

       return (
         <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">

           <div className="form-group">
            <label>Restaurant</label>
             <input type="text" className="form-control" id="restaurant" placeholder="Where did you eat?"/>
           </div>

           <div className="form-group">
            <label>Foodie</label>
             <input type="text" className="form-control" id="dish" placeholder="What did you eat?"/>
           </div>

           <div className="form-group">
               <label for="exampleInputFile">Upload Picture</label>
               <input style={style} ref="upload" type="file" accept="image/*" onSubmit={this.handleSubmit} onChange={ this.onChange }/>
               <p className="help-block">{ image }</p>
           </div>           

           <div className="form-group">
           <label>Price Rating</label>
             <select id="dishPrice" className="form-control">
               <option>$</option>
               <option>$$</option>
               <option>$$$</option>
             </select>
           </div>

           <div className="form-group">
           <label>Category</label>
             <select id="category" className="form-control">
               <option>Snack</option>
               <option>Grub</option>
               <option>Dessert</option>
             </select>
           </div>

           <div className="form-group">
            <label>Rate Your Foodie!</label>
            <p id="star-rating"></p>
           </div>

             <button className="btn btn-primary form-control" onClick={this.handleClick}>Share My Thoughts!</button>

         </div>
       )
   }
});

var Test = React.createClass({

    onChange: function (file) {
        console.log('done', file);
    },

    render: function () {
        return <div>
            <Entry className="entry" maxHeight={300} maxWidth={300} onChange={ this.onChange } />
        </div>
    }
});

module.exports = Entry;
module.exports = Test;
