/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 * 
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2015 David Stutz
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * 
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2015 David Stutz
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
!function(t){"use strict";function e(t,e){for(var i=0;i<t.length;++i)e(t[i],i)}function i(e,i){this.$select=t(e),this.$select.attr("data-placeholder")&&(i.nonSelectedText=this.$select.data("placeholder")),this.options=this.mergeOptions(t.extend({},i,this.$select.data())),this.originalOptions=this.$select.clone()[0].options,this.query="",this.searchTimeout=null,this.lastToggledInput=null,this.options.multiple="multiple"===this.$select.attr("multiple"),this.options.onChange=t.proxy(this.options.onChange,this),this.options.onDropdownShow=t.proxy(this.options.onDropdownShow,this),this.options.onDropdownHide=t.proxy(this.options.onDropdownHide,this),this.options.onDropdownShown=t.proxy(this.options.onDropdownShown,this),this.options.onDropdownHidden=t.proxy(this.options.onDropdownHidden,this),this.buildContainer(),this.buildButton(),this.buildDropdown(),this.buildSelectAll(),this.buildDropdownOptions(),this.buildFilter(),this.updateButtonText(),this.updateSelectAll(),this.options.disableIfEmpty&&t("option",this.$select).length<=0&&this.disable(),this.$select.hide().after(this.$container)}"undefined"!=typeof ko&&ko.bindingHandlers&&!ko.bindingHandlers.multiselect&&(ko.bindingHandlers.multiselect={after:["options","value","selectedOptions"],init:function(e,i,s,l,o){var n=t(e),a=ko.toJS(i());if(n.multiselect(a),s.has("options")){var p=s.get("options");ko.isObservable(p)&&ko.computed({read:function(){p(),setTimeout(function(){var t=n.data("multiselect");t&&t.updateOriginalOptions(),n.multiselect("rebuild")},1)},disposeWhenNodeIsRemoved:e})}if(s.has("value")){var h=s.get("value");ko.isObservable(h)&&ko.computed({read:function(){h(),setTimeout(function(){n.multiselect("refresh")},1)},disposeWhenNodeIsRemoved:e}).extend({rateLimit:100,notifyWhenChangesStop:!0})}if(s.has("selectedOptions")){var r=s.get("selectedOptions");ko.isObservable(r)&&ko.computed({read:function(){r(),setTimeout(function(){n.multiselect("refresh")},1)},disposeWhenNodeIsRemoved:e}).extend({rateLimit:100,notifyWhenChangesStop:!0})}ko.utils.domNodeDisposal.addDisposeCallback(e,function(){n.multiselect("destroy")})},update:function(e,i,s,l,o){var n=t(e),a=ko.toJS(i());n.multiselect("setOptions",a),n.multiselect("rebuild")}}),i.prototype={defaults:{buttonText:function(e,i){if(0===e.length)return this.nonSelectedText;if(this.allSelectedText&&e.length===t("option",t(i)).length&&1!==t("option",t(i)).length&&this.multiple)return this.selectAllNumber?this.allSelectedText+" ("+e.length+")":this.allSelectedText;if(e.length>this.numberDisplayed)return e.length+" "+this.nSelectedText;var s="",l=this.delimiterText;return e.each(function(){var e=void 0!==t(this).attr("label")?t(this).attr("label"):t(this).text();s+=e+l}),s.substr(0,s.length-2)},buttonTitle:function(e,i){if(0===e.length)return this.nonSelectedText;var s="",l=this.delimiterText;return e.each(function(){var e=void 0!==t(this).attr("label")?t(this).attr("label"):t(this).text();s+=e+l}),s.substr(0,s.length-2)},optionLabel:function(e){return t(e).attr("label")||t(e).text()},onChange:function(t,e){},onDropdownShow:function(t){},onDropdownHide:function(t){},onDropdownShown:function(t){},onDropdownHidden:function(t){},onSelectAll:function(){},enableHTML:!1,buttonClass:"btn btn-default",inheritClass:!1,buttonWidth:"auto",buttonContainer:'<div class="btn-group" />',dropRight:!1,selectedClass:"active",maxHeight:!1,checkboxName:!1,includeSelectAllOption:!1,includeSelectAllIfMoreThan:0,selectAllText:" Select all",selectAllValue:"multiselect-all",selectAllName:!1,selectAllNumber:!0,enableFiltering:!1,enableCaseInsensitiveFiltering:!1,enableClickableOptGroups:!1,filterPlaceholder:"Search",filterBehavior:"text",includeFilterClearBtn:!0,preventInputChangeEvent:!1,nonSelectedText:"None selected",nSelectedText:"selected",allSelectedText:"All selected",numberDisplayed:3,disableIfEmpty:!1,delimiterText:", ",templates:{button:'<button type="button" class="multiselect dropdown-toggle text-left" data-toggle="dropdown"><span style="font-weight:normal;" class="multiselect-selected-text"></span> <b class="caret"></b></button>',ul:'<ul class="multiselect-container dropdown-menu"></ul>',filter:'<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',filterClearBtn:'<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',li:'<li><a tabindex="0"><label></label></a></li>',divider:'<li class="multiselect-item divider"></li>',liGroup:'<li class="multiselect-item multiselect-group"><label></label></li>'}},constructor:i,buildContainer:function(){this.$container=t(this.options.buttonContainer),this.$container.on("show.bs.dropdown",this.options.onDropdownShow),this.$container.on("hide.bs.dropdown",this.options.onDropdownHide),this.$container.on("shown.bs.dropdown",this.options.onDropdownShown),this.$container.on("hidden.bs.dropdown",this.options.onDropdownHidden)},buildButton:function(){this.$button=t(this.options.templates.button).addClass(this.options.buttonClass),this.$select.attr("class")&&this.options.inheritClass&&this.$button.addClass(this.$select.attr("class")),this.$select.prop("disabled")?this.disable():this.enable(),this.options.buttonWidth&&"auto"!==this.options.buttonWidth&&(this.$button.css({width:this.options.buttonWidth,overflow:"hidden","text-overflow":"ellipsis"}),this.$container.css({width:this.options.buttonWidth}));var e=this.$select.attr("tabindex");e&&this.$button.attr("tabindex",e),this.$container.prepend(this.$button)},buildDropdown:function(){this.$ul=t(this.options.templates.ul),this.options.dropRight&&this.$ul.addClass("pull-right"),this.options.maxHeight&&this.$ul.css({"max-height":this.options.maxHeight+"px","overflow-y":"auto","overflow-x":"hidden"}),this.$container.append(this.$ul)},buildDropdownOptions:function(){this.$select.children().each(t.proxy(function(e,i){var s=t(i),l=s.prop("tagName").toLowerCase();s.prop("value")!==this.options.selectAllValue&&("optgroup"===l?this.createOptgroup(i):"option"===l&&("divider"===s.data("role")?this.createDivider():this.createOptionValue(i)))},this)),t("li input",this.$ul).on("change",t.proxy(function(e){var i=t(e.target),s=i.prop("checked")||!1,l=i.val()===this.options.selectAllValue;this.options.selectedClass&&(s?i.closest("li").addClass(this.options.selectedClass):i.closest("li").removeClass(this.options.selectedClass));var o=i.val(),n=this.getOptionByValue(o),a=t("option",this.$select).not(n),p=t("input",this.$container).not(i);return l&&(s?this.selectAll():this.deselectAll()),l||(s?(n.prop("selected",!0),this.options.multiple?n.prop("selected",!0):(this.options.selectedClass&&t(p).closest("li").removeClass(this.options.selectedClass),t(p).prop("checked",!1),a.prop("selected",!1),this.$button.click()),"active"===this.options.selectedClass&&a.closest("a").css("outline","")):n.prop("selected",!1)),this.$select.change(),this.updateButtonText(),this.updateSelectAll(),this.options.onChange(n,s),this.options.preventInputChangeEvent?!1:void 0},this)),t("li a",this.$ul).on("mousedown",function(t){return t.shiftKey?!1:void 0}),t("li a",this.$ul).on("touchstart click",t.proxy(function(e){e.stopPropagation();var i=t(e.target);if(e.shiftKey&&this.options.multiple){i.is("label")&&(e.preventDefault(),i=i.find("input"),i.prop("checked",!i.prop("checked")));var s=i.prop("checked")||!1;if(null!==this.lastToggledInput&&this.lastToggledInput!==i){var l=i.closest("li").index(),o=this.lastToggledInput.closest("li").index();if(l>o){var n=o;o=l,l=n}++o;var a=this.$ul.find("li").slice(l,o).find("input");a.prop("checked",s),this.options.selectedClass&&a.closest("li").toggleClass(this.options.selectedClass,s);for(var p=0,h=a.length;h>p;p++){var r=t(a[p]),c=this.getOptionByValue(r.val());c.prop("selected",s)}}i.trigger("change")}i.is("input")&&!i.closest("li").is(".multiselect-item")&&(this.lastToggledInput=i),i.blur()},this)),this.$container.off("keydown.multiselect").on("keydown.multiselect",t.proxy(function(e){if(!t('input[type="text"]',this.$container).is(":focus"))if(9===e.keyCode&&this.$container.hasClass("open"))this.$button.click();else{var i=t(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");if(!i.length)return;var s=i.index(i.filter(":focus"));38===e.keyCode&&s>0?s--:40===e.keyCode&&s<i.length-1?s++:~s||(s=0);var l=i.eq(s);if(l.focus(),32===e.keyCode||13===e.keyCode){var o=l.find("input");o.prop("checked",!o.prop("checked")),o.change()}e.stopPropagation(),e.preventDefault()}},this)),this.options.enableClickableOptGroups&&this.options.multiple&&t("li.multiselect-group",this.$ul).on("click",t.proxy(function(e){e.stopPropagation();var i=t(e.target).parent(),s=i.nextUntil("li.multiselect-group"),l=s.filter(":visible:not(.disabled)"),o=!0,n=l.find("input");n.each(function(){o=o&&t(this).prop("checked")}),n.prop("checked",!o).trigger("change")},this))},createOptionValue:function(e){var i=t(e);i.is(":selected")&&i.prop("selected",!0);var s=this.options.optionLabel(e),l=i.val(),o=this.options.multiple?"checkbox":"radio",n=t(this.options.templates.li),a=t("label",n);a.addClass(o),this.options.enableHTML?a.html(" "+s):a.text(" "+s);var p=t("<input/>").attr("type",o);this.options.checkboxName&&p.attr("name",this.options.checkboxName),a.prepend(p);var h=i.prop("selected")||!1;p.val(l),l===this.options.selectAllValue&&(n.addClass("multiselect-item multiselect-all"),p.parent().parent().addClass("multiselect-all")),a.attr("title",i.attr("title")),this.$ul.append(n),i.is(":disabled")&&p.attr("disabled","disabled").prop("disabled",!0).closest("a").attr("tabindex","-1").closest("li").addClass("disabled"),p.prop("checked",h),h&&this.options.selectedClass&&p.closest("li").addClass(this.options.selectedClass)},createDivider:function(e){var i=t(this.options.templates.divider);this.$ul.append(i)},createOptgroup:function(e){var i=t(e).prop("label"),s=t(this.options.templates.liGroup);this.options.enableHTML?t("label",s).html(i):t("label",s).text(i),this.options.enableClickableOptGroups&&s.addClass("multiselect-group-clickable"),this.$ul.append(s),t(e).is(":disabled")&&s.addClass("disabled"),t("option",e).each(t.proxy(function(t,e){this.createOptionValue(e)},this))},buildSelectAll:function(){"number"==typeof this.options.selectAllValue&&(this.options.selectAllValue=this.options.selectAllValue.toString());var e=this.hasSelectAll();if(!e&&this.options.includeSelectAllOption&&this.options.multiple&&t("option",this.$select).length>this.options.includeSelectAllIfMoreThan){this.options.includeSelectAllDivider&&this.$ul.prepend(t(this.options.templates.divider));var i=t(this.options.templates.li);t("label",i).addClass("checkbox"),this.options.enableHTML?t("label",i).html(" "+this.options.selectAllText):t("label",i).text(" "+this.options.selectAllText),this.options.selectAllName?t("label",i).prepend('<input type="checkbox" name="'+this.options.selectAllName+'" />'):t("label",i).prepend('<input type="checkbox" />');var s=t("input",i);s.val(this.options.selectAllValue),i.addClass("multiselect-item multiselect-all"),s.parent().parent().addClass("multiselect-all"),this.$ul.prepend(i),s.prop("checked",!1)}},buildFilter:function(){if(this.options.enableFiltering||this.options.enableCaseInsensitiveFiltering){var e=Math.max(this.options.enableFiltering,this.options.enableCaseInsensitiveFiltering);if(this.$select.find("option").length>=e){if(this.$filter=t(this.options.templates.filter),t("input",this.$filter).attr("placeholder",this.options.filterPlaceholder),this.options.includeFilterClearBtn){var i=t(this.options.templates.filterClearBtn);i.on("click",t.proxy(function(e){clearTimeout(this.searchTimeout),this.$filter.find(".multiselect-search").val(""),t("li",this.$ul).show().removeClass("filter-hidden"),this.updateSelectAll()},this)),this.$filter.find(".input-group").append(i)}this.$ul.prepend(this.$filter),this.$filter.val(this.query).on("click",function(t){t.stopPropagation()}).on("input keydown",t.proxy(function(e){13===e.which&&e.preventDefault(),clearTimeout(this.searchTimeout),this.searchTimeout=this.asyncFunction(t.proxy(function(){if(this.query!==e.target.value){this.query=e.target.value;var i,s;t.each(t("li",this.$ul),t.proxy(function(e,l){var o=t("input",l).length>0?t("input",l).val():"",n=t("label",l).text(),a="";if("text"===this.options.filterBehavior?a=n:"value"===this.options.filterBehavior?a=o:"both"===this.options.filterBehavior&&(a=n+"\n"+o),o!==this.options.selectAllValue&&n){var p=!1;this.options.enableCaseInsensitiveFiltering&&a.toLowerCase().indexOf(this.query.toLowerCase())>-1?p=!0:a.indexOf(this.query)>-1&&(p=!0),t(l).toggle(p).toggleClass("filter-hidden",!p),t(l).hasClass("multiselect-group")?(i=l,s=p):(p&&t(i).show().removeClass("filter-hidden"),!p&&s&&t(l).show().removeClass("filter-hidden"))}},this))}this.updateSelectAll()},this),300,this)},this))}}},destroy:function(){this.$container.remove(),this.$select.show(),this.$select.data("multiselect",null)},refresh:function(){t("option",this.$select).each(t.proxy(function(e,i){var s=t("li input",this.$ul).filter(function(){return t(this).val()===t(i).val()});t(i).is(":selected")?(s.prop("checked",!0),this.options.selectedClass&&s.closest("li").addClass(this.options.selectedClass)):(s.prop("checked",!1),this.options.selectedClass&&s.closest("li").removeClass(this.options.selectedClass)),t(i).is(":disabled")?s.attr("disabled","disabled").prop("disabled",!0).closest("li").addClass("disabled"):s.prop("disabled",!1).closest("li").removeClass("disabled")},this)),this.updateButtonText(),this.updateSelectAll()},select:function(e,i){t.isArray(e)||(e=[e]);for(var s=0;s<e.length;s++){var l=e[s];if(null!==l&&void 0!==l){var o=this.getOptionByValue(l),n=this.getInputByValue(l);void 0!==o&&void 0!==n&&(this.options.multiple||this.deselectAll(!1),this.options.selectedClass&&n.closest("li").addClass(this.options.selectedClass),n.prop("checked",!0),o.prop("selected",!0),i&&this.options.onChange(o,!0))}}this.updateButtonText(),this.updateSelectAll()},clearSelection:function(){this.deselectAll(!1),this.updateButtonText(),this.updateSelectAll()},deselect:function(e,i){t.isArray(e)||(e=[e]);for(var s=0;s<e.length;s++){var l=e[s];if(null!==l&&void 0!==l){var o=this.getOptionByValue(l),n=this.getInputByValue(l);void 0!==o&&void 0!==n&&(this.options.selectedClass&&n.closest("li").removeClass(this.options.selectedClass),n.prop("checked",!1),o.prop("selected",!1),i&&this.options.onChange(o,!1))}}this.updateButtonText(),this.updateSelectAll()},selectAll:function(e,i){var e="undefined"==typeof e?!0:e,s=t("li input[type='checkbox']:enabled",this.$ul),l=s.filter(":visible"),o=s.length,n=l.length;if(e?(l.prop("checked",!0),t("li:not(.divider):not(.disabled)",this.$ul).filter(":visible").addClass(this.options.selectedClass)):(s.prop("checked",!0),t("li:not(.divider):not(.disabled)",this.$ul).addClass(this.options.selectedClass)),o===n||e===!1)t("option:enabled",this.$select).prop("selected",!0);else{var a=l.map(function(){return t(this).val()}).get();t("option:enabled",this.$select).filter(function(e){return-1!==t.inArray(t(this).val(),a)}).prop("selected",!0)}i&&this.options.onSelectAll()},deselectAll:function(e){var e="undefined"==typeof e?!0:e;if(e){var i=t("li input[type='checkbox']:not(:disabled)",this.$ul).filter(":visible");i.prop("checked",!1);var s=i.map(function(){return t(this).val()}).get();t("option:enabled",this.$select).filter(function(e){return-1!==t.inArray(t(this).val(),s)}).prop("selected",!1),this.options.selectedClass&&t("li:not(.divider):not(.disabled)",this.$ul).filter(":visible").removeClass(this.options.selectedClass)}else t("li input[type='checkbox']:enabled",this.$ul).prop("checked",!1),t("option:enabled",this.$select).prop("selected",!1),this.options.selectedClass&&t("li:not(.divider):not(.disabled)",this.$ul).removeClass(this.options.selectedClass)},rebuild:function(){this.$ul.html(""),this.options.multiple="multiple"===this.$select.attr("multiple"),this.buildSelectAll(),this.buildDropdownOptions(),this.buildFilter(),this.updateButtonText(),this.updateSelectAll(),this.options.disableIfEmpty&&t("option",this.$select).length<=0?this.disable():this.enable(),this.options.dropRight&&this.$ul.addClass("pull-right")},dataprovider:function(i){var s=0,l=this.$select.empty();t.each(i,function(i,o){var n;t.isArray(o.children)?(s++,n=t("<optgroup/>").attr({label:o.label||"Group "+s,disabled:!!o.disabled}),e(o.children,function(e){n.append(t("<option/>").attr({value:e.value,label:e.label||e.value,title:e.title,selected:!!e.selected,disabled:!!e.disabled}))})):n=t("<option/>").attr({value:o.value,label:o.label||o.value,title:o.title,selected:!!o.selected,disabled:!!o.disabled}),l.append(n)}),this.rebuild()},enable:function(){this.$select.prop("disabled",!1),this.$button.prop("disabled",!1).removeClass("disabled")},disable:function(){this.$select.prop("disabled",!0),this.$button.prop("disabled",!0).addClass("disabled")},setOptions:function(t){this.options=this.mergeOptions(t)},mergeOptions:function(e){return t.extend(!0,{},this.defaults,this.options,e)},hasSelectAll:function(){return t("li.multiselect-all",this.$ul).length>0},updateSelectAll:function(){if(this.hasSelectAll()){var e=t("li:not(.multiselect-item):not(.filter-hidden) input:enabled",this.$ul),i=e.length,s=e.filter(":checked").length,l=t("li.multiselect-all",this.$ul),o=l.find("input");s>0&&s===i?(o.prop("checked",!0),l.addClass(this.options.selectedClass),this.options.onSelectAll()):(o.prop("checked",!1),l.removeClass(this.options.selectedClass))}},updateButtonText:function(){var e=this.getSelected();this.options.enableHTML?t(".multiselect .multiselect-selected-text",this.$container).html(this.options.buttonText(e,this.$select)):t(".multiselect .multiselect-selected-text",this.$container).text(this.options.buttonText(e,this.$select)),t(".multiselect",this.$container).attr("title",this.options.buttonTitle(e,this.$select))},getSelected:function(){return t("option",this.$select).filter(":selected")},getOptionByValue:function(e){for(var i=t("option",this.$select),s=e.toString(),l=0;l<i.length;l+=1){var o=i[l];if(o.value===s)return t(o)}},getInputByValue:function(e){for(var i=t("li input",this.$ul),s=e.toString(),l=0;l<i.length;l+=1){var o=i[l];if(o.value===s)return t(o)}},updateOriginalOptions:function(){this.originalOptions=this.$select.clone()[0].options},asyncFunction:function(t,e,i){var s=Array.prototype.slice.call(arguments,3);return setTimeout(function(){t.apply(i||window,s)},e)},setAllSelectedText:function(t){this.options.allSelectedText=t,this.updateButtonText()}},t.fn.multiselect=function(e,s,l){return this.each(function(){var o=t(this).data("multiselect"),n="object"==typeof e&&e;o||(o=new i(this,n),t(this).data("multiselect",o)),"string"==typeof e&&(o[e](s,l),"destroy"===e&&t(this).data("multiselect",!1))})},t.fn.multiselect.Constructor=i,t(function(){t("select[data-role=multiselect]").multiselect()})}(window.jQuery);