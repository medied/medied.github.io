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
		cms: 5.25,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	},
	{
		nd: 'IP',
		cms: 5.25,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	},
	{
		nd: 'FS',
		cms: 3.75,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	}, 
	{
		nd: 'iOS',
		cms: 3.75,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	}, 
	{
		nd: 'AND',
		cms: 3.75,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	},
	{
		nd: 'TE',
		cms: 2,
		studentsCurrentWeek: 0,
		studentsPastWeek: 0,
		ratio: 0
	}
];

var Nanodegree = function(data) {
	this.nd = ko.observable(data.nd);
	this.cms = ko.observable(data.cms)
	this.studentsCurrentWeek = ko.observable(data.studentsCurrentWeek);
	this.studentsPastWeek = ko.observable(data.studentsPastWeek);
	this.ratio = ko.observable(data.ratio);
};

// var firebase = new Firebase("luminous-heat-6809.firebaseIO.com");

var ViewModel = function() {
	console.log("ViewModel initialized");
	var self = this;
	
	self.hiddenUntilCompute = ko.observable(false);

	self.ndList = ko.observableArray([]);
	// self.ndList = KnockoutFire.observable(firebase, {});

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


	self.compute = function () {
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
			runningTotalCurrentStudents += currentStudentsIntHolder;
			
			console.log("PastStudents");
			strHolder = self.ndList()[nd].studentsPastWeek(); 
			pastStudentsIntHolder = parseInt(strHolder.replace(/,/g, ''), 10);
			runningTotalPastStudents += pastStudentsIntHolder;
			
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

	self.edit = function (nd) {
		console.log("edit() invoked");
		console.log("Current number of CMs in the ND you last clicked on, before changing anything: ");
		console.log(nd.cms());

		//get input from user and update CMs number to appropriate ND
		var newCMsNumber = window.prompt("Enter new number of CMs below");
		for (var i = 0; i < self.ndList().length; i++){ 
			// console.log(self.ndList()[i].nd());
			if (self.ndList()[i].nd() == nd.nd()) {
				console.log("ND identified to update: ");
				console.log(self.ndList()[i].nd());
				console.log("CMs number before: ");
				console.log(self.ndList()[i].cms());
				console.log("Updating...");

				self.ndList()[i].cms(newCMsNumber)
				// self.ndList()[i].cms(newCMsNumber).extend({localStorage: "cms"});
				
				console.log("CMs number after: ");
				console.log(self.ndList()[i].cms());
			}
		}	
	};

	self.addND = function () {
		console.log("addND() invoked");
		var newND = window.prompt("Enter new Nanodegree below");
		var newCMsNumber = window.prompt("Enter respective number of CMs below");

		var nd = {
			nd: newND,
			cms: newCMsNumber,
			studentsCurrentWeek: 0,
			studentsPastWeek: 0,
			ratio: 0
		}

		self.ndList.push(new Nanodegree(nd));

	};

};


ko.applyBindings(new ViewModel());
