var ndsInitial = [
	{
		nd: 'FE',
		cms: 5,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	},
	{
		nd: 'DA',
		cms: 0.75*7,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	},
	{
		nd: 'IP',
		cms: 0.75*7,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	},
	{
		nd: 'FS',
		cms: 0.75*5,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	}, 
	{
		nd: 'iOS',
		cms: 0.75*5,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	}, 
	{
		nd: 'AND',
		cms: 0.75*5,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	}
];

var Nanodegree = function(data) {
	this.nd = ko.observable(data.nd);
	this.cms = ko.observable(data.cms);
	this.studentsCurrentWeek = ko.observable(data.studentsCurrentWeek);
	this.studentsPastWeek = ko.observable(data.studentsPastWeek);
	this.ratio = ko.observable(data.ratio);
};

var ViewModel = function() {
	console.log("ViewModel initialized");
	var self = this;
	self.hiddenUntilCompute = ko.observable(false);

	self.ndList = ko.observableArray([]);
	self.ndListComputed = ko.observableArray([]);
	ndsInitial.forEach(function(nd){
		self.ndList.push(new Nanodegree(nd));
	});

	
	// Computed totals 
	self.totalCMs = ko.observable();
	self.totalCurrentStudents = ko.observable();
	self.totalPastStudents = ko.observable();
	self.totalRatio = ko.observableArray();
	self.totalPercentChange = ko.observableArray();


	this.compute = function () {
		console.log("compute() - I will compute");

		var runningTotalCMs = 0;
		var runningTotalCurrentStudents = 0;
		var runningTotalPastStudents = 0;
		var strHolder = '';
		var currentStudentsIntHolder = 0;
		var pastStudentsIntHolder = 0;

		for (var nd = 0; nd < self.ndList().length; nd++) {

			// Computing totals
			runningTotalCMs += self.ndList()[nd].cms();

			console.log("CurrentStudents");
			strHolder = self.ndList()[nd].studentsCurrentWeek(); //Invoking .replace() directly on the observable array not permitted
			currentStudentsIntHolder = parseInt(strHolder.replace(/,/g, ''), 10);
			// console.log(typeof currentStudentsStrHolder);
			runningTotalCurrentStudents += currentStudentsIntHolder;
			// console.log("runningTotalCurrentStudents");
			// console.log(typeof	runningTotalCurrentStudents);
			// console.log(runningTotalCurrentStudents);

			console.log("PastStudents");
			strHolder = self.ndList()[nd].studentsPastWeek(); 
			pastStudentsIntHolder = parseInt(strHolder.replace(/,/g, ''), 10);
			// console.log(typeof pastStudentsStrHolder);
			runningTotalPastStudents += pastStudentsIntHolder;
			// console.log("runningTotalPastStudents")
			// console.log(typeof runningTotalPastStudents);
			// console.log(runningTotalPastStudents);

			// Computing ND-specific
			ratio = (currentStudentsIntHolder) / (self.ndList()[nd].cms());
			percentChange = (currentStudentsIntHolder - pastStudentsIntHolder) / currentStudentsIntHolder;
			self.ndListComputed.push({
				theND: self.ndList()[nd].nd(),
				theRatio: ratio, 
				thePercentChange: percentChange,
				currentWeek: self.ndList()[nd].studentsCurrentWeek(),
				theCMs: self.ndList()[nd].cms()
			});
		};

		self.hiddenUntilCompute(true);
		self.totalCMs(runningTotalCMs);
		self.totalCurrentStudents(runningTotalCurrentStudents);
		self.totalPastStudents(runningTotalPastStudents);
		self.totalRatio(runningTotalCurrentStudents / runningTotalCMs);
		self.totalPercentChange((runningTotalCurrentStudents - runningTotalPastStudents)/(runningTotalCurrentStudents)); 

		console.log(self.totalCMs());
		console.log(self.totalCurrentStudents());
		console.log(self.totalPastStudents());
		console.log(self.totalRatio());
		console.log(self.totalPercentChange());
	};

};

ko.applyBindings(new ViewModel());