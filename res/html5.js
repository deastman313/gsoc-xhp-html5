if (typeof xhp_html5 == "undefined") {
	
	$("<style type='text/css'> .html5-invalid { border: 2px solid red; } </style>").appendTo("head");
	
	function iso8601WeekInverse(year,week) {
		var checkDate = new Date(year,0,1);
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
		//checkDate now has the date of the first thursday of the year
		checkDate.setDate(checkDate.getDate() + (week*7));
		return checkDate;
	}

	xhp_html5 = true;
	xhp_datalists = [];
	
	xhp_a = function(id,options) {
		if (options.ping) {
			$("#"+id).click(function() {
				urls = options.ping.split(" ");
				jQuery.each(urls,function(index,value) {
					$.ajax({async:false,url:value});
				});
				return true;
			});
		}
	};
	
	xhp_area = xhp_a;
	
	xhp_datalist = function(id, options) {
		xhp_datalists[id] = options;
	}
	
	xhp_fieldset = function(id,options) {
		var fieldset = document.getElementById(id);
		if (options.disabled) {
			//disable the input elements that are not inside the legend
			$("#"+id).children(":not(legend)").find("*").attr("disabled","disabled");
		}
		fieldset.enabled = !options.disabled;
		fieldset.enable = function() {
			$("#"+id).children(":not(legend)").find("*").removeAttr('disabled');
			fieldset.enabled = true;
		};
		fieldset.disable = function() {
			$("#"+id).children(":not(legend)").find("*").attr("disabled","disabled");
			fieldset.enabled = false;
		};
		fieldset.isEnabled = function() {
			return fieldset.enabled;
		};
		fieldset.toggle = function() {
			if (fieldset.isEnabled()) {
				fieldset.disable();
			} else {
				fieldset.enable();
			}
		};
	};
	
	xhp_form = function(id,options) {
		
		var form = document.getElementById(id);
		
		if (options.novalidate) {
			form.xhp_novalidate = options.novalidate;
		}

		$('#'+id).submit(function(event) {
			if (form.xhp_novalidate)
				return true;
			
			var allValid = true;
			
			$('#'+id).find("input,textarea,select").each(function() {
				if (!this.isValid()) {
					$(this).addClass("html5-invalid");
					allValid = false;
				} else {
					$(this).removeClass("html5-invalid");
				}
			});
			
			return allValid;
		});	
	}
	
	xhp_input = function(id, options) {
		
		var input = document.getElementById(id);
		
		input.isValid = function() {
			if (options.required) {
				if (input.value == '')
					return false;
			}
			if (options.pattern) {
				var patternRegexp = new RegExp("^(?:"+options.pattern+")$");
				if (input.value != '' && input.value.match(patternRegexp) == null)
					return false;
			}
			if (options.type == "url") {
				var urlRegExp = new RegExp('^(https?|ftp|gopher|telnet|file|notes|ms-help):((//)|(\\\\))+[\\w\\d:#@%/;$()~_?\+-=\\\.&]*$');
				if (input.value != '' && input.value.match(urlRegExp) == null)
					return false;
			}
			if (options.type == "number") {
				var numberRegExp = new RegExp('^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$');
				if (input.value != '' && input.value.match(numberRegExp) == null)
					return false;
				
				if (options.min && parseFloat(input.value) < parseFloat(options.min))
					return false;
				if (options.max && parseFloat(input.value) > parseFloat(options.max))
					return false;
			}
			if (options.type == "email") {
				var emailRegExp = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$');
				if (input.value != '' && input.value.match(emailRegExp) == null)
					return false;
			}
			if (options.type == "date") {
				var datetimelocalRegExp = new RegExp('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$');
				if (input.value != '' && input.value.match(datetimelocalRegExp) == null)
					return false;
			}
			if (options.type == "month") {
				var datetimelocalRegExp = new RegExp('^\\d{4}-(0[1-9]|1[012])$');
				if (input.value != '' && input.value.match(datetimelocalRegExp) == null)
					return false;
			}
			if (options.type == "week") {
				var datetimelocalRegExp = new RegExp('^\\d{4}-W(0[1-9]|[1-4][0-9]|5[012])$');
				if (input.value != '' && input.value.match(datetimelocalRegExp) == null)
					return false;
			}
			if (options.type == "time") {
				var datetimelocalRegExp = new RegExp('^([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9](\\.\d+)?)?$');
				if (input.value != '' && input.value.match(datetimelocalRegExp) == null)
					return false;
			}
			if (options.type == "datetime-local") {
				var datetimelocalRegExp = new RegExp('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9](\\.\d+)?)?$');
				if (input.value != '' && input.value.match(datetimelocalRegExp) == null)
					return false;
			}
			if (options.type == "datetime") {
				var datetimelocalRegExp = new RegExp('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9](\\.\\d+)?)?(Z|[\\+-]([0-1][0-9]|2[0-3]):[0-5][0-9])?$');
				if (input.value != '' && input.value.match(datetimelocalRegExp) == null)
					return false;
			}
			return true;
		}
		
		//input onchange validation
		$(input).bind('change load keyup focus',function(event) {
			if (input.form && input.form.xhp_novalidate) {
				//do nothing
			} else {
				if (this.isValid()) {
					$(this).removeClass("html5-invalid");
				} else {
					$(this).addClass("html5-invalid");
				}
			}
		});
		
		if (options.placeholder) {
		
			var default_color = input.style.color;
			var color = 'gray';
			
			if (input.value === '' || input.value == options.placeholder) {
			    input.value = options.placeholder;
			    input.style.color = color;
			}
			
			var onfocus = function() {
				if (input.value == options.placeholder && input.style.color == color) {
					input.value = '';
					input.style.color = default_color;
				}
			};
			
			var onblur = function() {
				if (input.value == '') {
					input.value = options.placeholder;
					input.style.color=color;
				}
			};
			
			$(input).focus(onfocus);
			$(input).blur(onblur);
			
			input.form && $(input.form).submit(function() {
				if (input.value == options.placeholder && input.style.color == color) {
					input.value = '';
				}
				input.form.submit();
			});
			
		}
		
		if (options.autofocus) {
			input.focus();
		}
		
//		if (options.required && input.form) {
//			$(input.form).submit(function(event) {
//				if (input.form.xhp_novalidate)
//					return true;
//				
//				if (input.value == '') {
//					input.focus();
//					return false;
//				} else {
//					return true;
//				}
//			});
//		}
		
		if (options.list) {
			if (options.multiple) {
				var split = function(val) {
					return val.split(/,\s*/);
				}
				var extractLast = function(term) {
					return split(term).pop();
				}
				
				$("#"+id).autocomplete({
					minLength: 0,
					source: function(request, response) {
						// delegate back to autocomplete, but extract the last term
						response($.ui.autocomplete.filter(xhp_datalists[options.list], extractLast(request.term)));
					},
					focus: function() {
						// prevent value inserted on focus
						return false;
					},
					select: function(event, ui) {
						var terms = split( this.value );
						// remove the current input
						terms.pop();
						// add the selected item
						terms.push( ui.item.value );
						// add placeholder to get the comma-and-space at the end
						terms.push("");
						this.value = terms.join(", ");
						return false;
					}
				});
			} else {
				$("#"+id).autocomplete({
					source: xhp_datalists[options.list], 
				});
			}
		}
		
//		if (options.pattern && input.form) {
//			$(input.form).submit(function(event) {
//				if (input.form.xhp_novalidate)
//					return true;
//				
//				var patternRegexp = new RegExp("^(?:"+options.pattern+")$");
//				if (input.value != '' && input.value.match(patternRegexp) == null) {
//					input.focus();
//					return false;
//				} else {
//					return true;
//				}
//			});
//			
//			$(input.form).change(function(event) {
//				if (input.form.xhp_novalidate) {
//					//do nothing
//				} else {
//					var patternRegexp = new RegExp("^(?:"+options.pattern+")$");
//					if (input.value != '' && input.value.match(patternRegexp) == null) {
//						$('#'+id).addClass("html5-invalid");
//					} else {
//						$('#'+id).removeClass("html5-invalid");
//					}
//				}
//			});
//		}
		
		if (options.type) {
			var changeTypeToText = function(id) {
				var marker = $('<span />').insertBefore('#'+id);
				$('#'+id).detach().attr("type","text").insertAfter(marker);
				marker.remove();
			}
			if (options.type == "number") {
			} else if (options.type == "color") {
				changeTypeToText(id);
				$('#'+id).ColorPicker({
					onSubmit: function(hsb, hex, rgb, el) {
						$(el).val(hex);
						$(el).css("background-color",hex);
						$(el).ColorPickerHide();
					},
					onBeforeShow: function () {
						$(this).ColorPickerSetColor(this.value);
					}
				}).bind('keyup', function(){
					$(this).ColorPickerSetColor(this.value);
				});
			} else if (options.type == "date") {
				changeTypeToText(id);
				dp = $('#'+id).datetimepicker({
					dateFormat: "yy-mm-dd",
					firstDay : 1,
					showButtonPanel: true,
					changeMonth: true,
					changeYear: true,
					showWeek: true,
					showHour: false,
					showMinute: false,
					showTime: false,
					holdDatepickerOpen: false,
					alwaysSetTime: false,
					closeText: "None"
				});
			} else if (options.type == "month") {
				changeTypeToText(id);
				$('#'+id).datetimepicker({
					dateFormat: "yy-mm-dd",
					firstDay : 1,
					showButtonPanel: true,
					changeMonth: true,
					changeYear: true,
					showWeek: true,
					showHour: false,
					showMinute: false,
					showTime: false,
					alwaysSetTime: false,
					holdDatepickerOpen: false,
					closeText: "None",
					scope: 'month',
					beforeShow: function(input,inst) {
						if (input.value && input.value.match(/\d{4}-\d{2}$/)) {
							input.value += "-01";
						}
						inst.settings.dateFormat = "yy-mm-dd";
						input.valueBefore = input.value;
					},
					onClose: function(dateText,inst) {
						inst.settings.dateFormat = "yy-mm";
						if (input.value == input.valueBefore) {
							var mydate = $('#'+id).datepicker("getDate");
							var month = (mydate.getMonth() < 10 ? "0" : "") + (mydate.getMonth()+1);
							input.value = mydate.getFullYear() + "-" + month;
						}
					}
				});
			} else if (options.type == "week") {
				changeTypeToText(id);
				$('#'+id).datetimepicker({
					dateFormat: "yy-mm-dd",
					firstDay : 1,
					showButtonPanel: true,
					changeMonth: true,
					changeYear: true,
					showWeek: true,
					showHour: false,
					showMinute: false,
					showTime: false,
					holdDatepickerOpen: false,
					alwaysSetTime: false,
					closeText: "None",
					scope: 'week',
					beforeShow: function(input,inst) {
						if (typeof input.value != "undefined" && input.value.indexOf("-W") != -1) {
							var year = input.value.split("-W")[0];
							var week = input.value.split("-W")[1];
							var weekDate = iso8601WeekInverse(year,week);
							inst.settings.dateFormat = "yy-mm-dd";
							var month = (weekDate.getMonth() < 10 ? "0" : "") + (weekDate.getMonth()+1);
							input.value = weekDate.getFullYear() + "-" + month + "-" + weekDate.getDate();
							input.valueBefore = input.value;
						}
					},
					onClose: function(dateText,inst) {
						var mydate = $('#'+id).datepicker("getDate");
						var week = $.datepicker.iso8601Week(mydate);
						var strWeek = (week < 10 ? "0" : "") + week;
						inst.settings.dateFormat = "yy-W"+strWeek;
						if (input.value == input.valueBefore) {
							input.value = mydate.getFullYear() + "-W" + strWeek;
						}
					}
				});
			} else if (options.type == "datetime") {
				changeTypeToText(id);
				$('#'+id).datetimepicker({
					dateFormat: "yy-mm-dd",
					firstDay : 1,
					showButtonPanel: true,
					withTime: true,
					changeMonth: true,
					changeYear: true,
					showWeek: true,
					closeText: "Done",
				});
			} else if (options.type == "datetime-local") {
				changeTypeToText(id);
				$('#'+id).datetimepicker({
					dateFormat: "yy-mm-dd",
					firstDay : 1,
					showButtonPanel: true,
					withTime: true,
					changeMonth: true,
					changeYear: true,
					showWeek: true,
					closeText: "Done",
				});
			} else if (options.type == "time") {
				changeTypeToText(id);
				$('#'+id).timepicker();
			} else if (options.type == "range") {
				changeTypeToText(id);
				var slider_orientation = $('#'+id).height() / $('#'+id).width() > 1.0 ? "vertical" : "horizontal";
				var cssName = slider_orientation == "vertical" ? "height" : "width";
				var cssSize = slider_orientation == "vertical" ? $('#'+id).height() : $('#'+id).width();
				marker = $('<div id="'+id+'_range" style="'+cssName+':'+cssSize+'" />').insertBefore('#'+id);
				marker.slider({
					value : input.value,
					min: parseFloat(options.min),
					max: parseFloat(options.max),
					step: parseFloat(options.step),
					orientation: slider_orientation,
					slide: function(event,ui) {
						$('#'+id).val(ui.value);
					}
				});
				$('#'+id).hide();
			} else if (options.type == "number") {
				console.log("here");
				changeTypeToText(id);
			} else if (options.type == "email") {
				changeTypeToText(id);
			} else if (options.type == "url") {
				changeTypeToText(id);
			} else {
				
			}
		}
	};

	xhp_button = xhp_input;

	xhp_select = xhp_input;
	
	xhp_textarea = xhp_input;
	
	xhp_progress = function(id, options) {
		var progress = $("#"+id);
		
		var calcProgressValue = function(paramValue) {
			var max = 1.0;
			if (options.max)
				max = parseFloat(options.max);
			var value = 0.0;
			if (typeof paramValue != "undefined") {
				value = parseFloat(paramValue);
			} else {
				value = max; //set to max so if not set it will be indeterminate
			}
			value = Math.max(0,Math.min(value,max));
			return (value / max) * 100;
		};
		
		progress.progressbar({
			value: calcProgressValue(options.value,options.max)
		});
		
		//create a function to read and change progress
		document.getElementById(id).setProgress = function(value) {
			progress.progressbar("value",calcProgressValue(value));
		}
		document.getElementById(id).getProgress = function() {
			return progress.progressbar("value") * options.max / 100; //rescaled to its original range
		}
		document.getElementById(id).incProgress = function(amount) {
			document.getElementById(id).setProgress(document.getElementById(id).getProgress() + amount);
		}
		document.getElementById(id).decProgress = function(amount) {
			document.getElementById(id).setProgress(document.getElementById(id).getProgress() - amount);
		}
	};
	
}