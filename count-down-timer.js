var countDown = (function($) {
	var Item = function(el, options) {
		this.$el = $(el);
		this.endTimeInMS = new Date(this.$el.data('count-down-time')).getTime();
		this.options = $.extend({}, this.options, options);
		this.interval = setInterval(this.update.bind(this), 1000);
		this.update();

		if (typeof this.options.onEnd !== 'function') {
			console.error('Invalid onEnd callback');
		}

		if (typeof this.options.format !== 'function') {
			console.error('Invanlid format function');
		}
	};

	Item.prototype.options = {
		onEnd: function(instance) {
			console.log(instance);
		},
		format: function(t) {
			var str = '';

			str += t.d + 'D ';
			str += t.h + 'H ';
			str += t.m + 'M ';
			str += t.s + 'S';

			return str;
		}
	};

	Item.prototype.getTimeDiff = function(time) {
		var diff = time - new Date().getTime();

		// Will never return negative values
		return {
			'd': Math.max(0, Math.floor(diff*(1/1000)*(1/3600)*(1/24))),
			'h': Math.max(0, Math.floor(diff%(1000*60*60*24)*1/(1000*60*60))),
			'm': Math.max(0, Math.floor(diff%(1000*60*60)*1/(1000*60))),
			's': Math.max(0, Math.floor(diff%(1000*60)*(1/1000))),
			'ms': Math.max(0, diff)
		};
	};

	Item.prototype.update = function() {
		var timeData = this.getTimeDiff(this.endTimeInMS);

		this.$el.html(this.options.format(timeData));

		if (timeData.ms <= 0) {
			clearInterval(this.interval);
			this.options.onEnd(this);
		}
	};


	return function(options) {
		// Init by selector
		$('*[data-count-down-time]').each(function() {
			new Item(this, options);
		});
	};
}(jQuery));