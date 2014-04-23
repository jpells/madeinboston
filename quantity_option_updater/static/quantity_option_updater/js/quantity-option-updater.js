var QuantityOptionUpdater = function(options) {
    this.form_selector = options.form_selector
    this.quantity_selector = options.quantity_selector
    this.option_selector = options.option_selector
    this.option_error_selector = options.option_error_selector
    this.quantity_error_selector = options.quantity_error_selector
    this.variations_json = options.variations_json
    this.form_element = null
    this.quantity_element = null
    this.options = null
    this.option_elements = null
    this.option_error_element = null
    this.quantity_error_element = null
    this.selected_options = null
    this.selected_variation = null
    this.last_selected_option = null
    this.last_selected_option_value = null
    this.option_errors = null
}

QuantityOptionUpdater.prototype.setup = function() {
    this.variations = jQuery.parseJSON(this.variations_json);
    this.form_element = jQuery(this.form_selector)
    this.quantity_element = this.form_element.find(this.quantity_selector)
    if (this.quantity_element.length > 0) {
        this.quantity_element = jQuery(this.quantity_element[0])
    } else {
        //item is not available for purchase
        this.quantity_element = null
    }
    this.set_options_from_variations()
    this.set_option_elements()
    this.option_error_element = jQuery(this.option_error_selector)
    this.quantity_error_element = jQuery(this.quantity_error_selector)
    this.update_options()
    this.set_selected_options()
    this.set_variation_from_selections()
    if (this.options.length < 1) {
        //don't initialize quantity to a select for products with different variations because it will break updating the image update
        this.update_quantity_select()
    }
    var self = this
    //Hook into the option change functionality in order to update the other options/quantity fields.
    for (option in self.option_elements) {
        option_element = self.option_elements[option]
        option_element.change(function() {
            self.option_errors = []
            self.option_error_element.html("")
            self.last_selected_option = jQuery(this).attr('name')
            self.last_selected_option_value = jQuery(this).attr('value')
            self.update_options()
            self.set_selected_options()
            self.set_variation_from_selections()
            self.update_quantity_select()
            if (self.option_errors.length > 0) {
                self.option_error_element.html(self.option_errors.join("<br />"))
                self.option_error_element.show("slow").delay(1000).hide("slow")
            }
        })
    }
    //Hook into the image thumbnail click functionality in order to update the other options/quantity fields.
    jQuery('#product-images-thumb a').click(function() {
        self.option_errors = []
        self.option_error_element.html("")
        self.last_selected_option = "image_id"
        self.last_selected_option_value = jQuery(this).attr('id').split("-")[1]
        self.update_options()
        self.set_selected_options()
        self.set_variation_from_selections()
        self.update_quantity_select()
        if (self.option_errors.length > 0) {
            self.option_error_element.html(self.option_errors.join("<br />"))
            self.option_error_element.show("slow").delay(1000).hide("slow")
        }
    })
}

QuantityOptionUpdater.prototype.set_options_from_variations = function() {
    //Sets the options that are available for the product.
    var self = this
    var options = []
    var first_variation = self.variations[0]
    jQuery.each(first_variation, function(attribute, value) {
        if (attribute.substring(0, 6) == "option") {
            var select_box = self.form_element.find("select[name='"+attribute+"']")
            if (select_box.length > 0) {
                options.push(attribute)
            }
        }
    })
    self.options = options
}

QuantityOptionUpdater.prototype.set_option_elements = function() {
    //Finds the option elements within the form.
    var self = this
    self.option_elements = []
    jQuery.each(self.options, function(index, option) {
        self.option_elements[option] = self.form_element.find(jQuery("#id_"+option))
        self.option_elements[option] = jQuery(self.option_elements[option][0])
    })
}

QuantityOptionUpdater.prototype.set_selected_options = function() {
    //Sets the selected options the user has chosen from the form.
    var self = this
    var selected_options = []
    jQuery.each(self.option_elements, function(index, option_element) {
        selected_options[option] = jQuery(option_element).find(":selected").text()
    })
    self.selected_options = selected_options
}

QuantityOptionUpdater.prototype.set_variation_from_selections = function() {
    //Sets the variation according to what the user has selected for the options.
    var self = this
    var this_variation = true
    jQuery.each(self.variations, function(index, variation) {
        jQuery.each(self.selected_options, function(index, option) {
            if (option == "") {
                option = null
            }
            if (variation[option_key] != option) {
                this_variation = false
            }
        })
        if (this_variation) {
            self.selected_variation = variation
            return null
        }
        return null
    })
    if (!this_variation) {
        self.selected_variation = null
        alert("ERROR")
    }
}

QuantityOptionUpdater.prototype.update_quantity_select = function() {
    //Update the quantity input text field to a select drop down allowing user to select the number in stock for the product variation the user has selected.
    var self = this
    if (self.quantity_element) {
        if (self.selected_variation["num_in_stock"] > 0) {
            if (self.quantity_element[0].localName != "select") {
                var new_options = ""
                for (var counter = 1; counter <= self.selected_variation["num_in_stock"]; counter++) {
                    new_options += '<option value="'+counter+'">'+counter+'</option>'
                }
                self.quantity_element.replaceWith('<select id="id_quantity" min="1" name="quantity" type="number">'+new_options+'</select>')
                self.quantity_element = self.form_element.find(self.quantity_selector)
                self.quantity_element = jQuery(self.quantity_element[0])
            } else {
                var options = self.quantity_element.find("option")
                if (options.size() < self.selected_variation["num_in_stock"]) {
                    var new_options = ""
                    for (var counter = options.size(); counter <= self.selected_variation["num_in_stock"]; counter++) {
                        new_options += '<option value="'+counter+'">'+counter+'</option>'
                    }
                    self.quantity_element.append(new_options)
                } else {
                    var selected_quantity = self.quantity_element.find("option:selected").attr('value')
                    if (selected_quantity > self.selected_variation["num_in_stock"]) {
                        self.quantity_error_element.html("Quantity "+self.quantity_element.find("option:selected").attr('value')+" of this product with current configuration is not available")
                        self.quantity_error_element.fadeIn("slow").delay(1000).fadeOut("slow")
                    }
                    options.each(function() {
                        var option = jQuery(this)
                        if (option.attr('value') > self.selected_variation["num_in_stock"]) {
                            option.remove()
                        }
                    })
                }
            }
        } else {
            //variation is sold out
            self.quantity_element.replaceWith('<p class="error-msg">This product with the current configuration is not available</p>')
        }
    }
}

QuantityOptionUpdater.prototype.get_variations_for_options = function() {
    //Gets the variations valid for the selected options.
    var self = this
    var variations = []
    jQuery.each(self.variations, function(index, variation) {
        if (variation[self.last_selected_option] == self.last_selected_option_value) {
            variations.push(variation)
        }
    })
    return variations
}

QuantityOptionUpdater.prototype.update_options = function() {
    //Updates the options based on the last chosen option in order to choose a variation that is valid.
    var self = this
    var variations = self.get_variations_for_options()
    var options = []
    jQuery.each(self.options, function(index, option) {
        if (option != self.last_selected_option) {
            var option_select_element = self.form_element.find("select[name='"+option+"']")
            var selected_option = option_select_element.find("option:selected").attr('value')
            var selected_option_is_valid = false
            jQuery.each(variations, function(index, variation) {
                if (variation[option] == selected_option) {
                    selected_option_is_valid = true
                }
            })
            if (!selected_option_is_valid) {
                variation = variations[0]
                self.selected_variation = variation
                var select_option = variation[option]
                option_select_element.attr('value', select_option)
                if (self.last_selected_option != "image_id") {
                    self.option_errors.push("This product does not come in "+selected_option+" and "+self.last_selected_option_value+" changed selection to "+select_option+".")
                } else {
                    self.last_selected_option = option
                    self.last_selected_option_value = select_option
                }
            }
        }
    })
}
