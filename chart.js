chart.attr('width', width + 'px').attr('height', height + 'px');

function Group(id, name, type, deps) { this.id = id; this.name = name; this.type = type; this.deps = deps }
function Sect(id, name, value, color) { this.id = id; this.name = name; this.value = value; this.color = color; }

var apg = new Group('apg', 'Apple Inc', 'lab');
var ear = new Group('ear', 'Earning', 'ear', ['usp', 'irp']);
var apu = new Group('apu', 'Apple US', 'lab');
var usr = new Group('usr', 'Revenue', 'rev');
var use = new Group('use', 'Expense', 'exp');
var usp = new Group('usp', 'Profit', 'pro', ['usr', 'use']);
var api = new Group('api', 'Apple Sales International (Ireland)', 'lab');
var irr = new Group('irr', 'Revenue', 'rev');
var ire = new Group('ire', 'Expense', 'exp');
var irp = new Group('irp', 'Profit', 'pro', ['irr', 'ire']);

var sip = new Sect('ip', 'Int. Prop', 15, '#3F652D');
var sipd = new Sect('ipd', 'IP Dev', 2, '#98041B');
// sre
var sre108 = new Sect('sre', 'Total Revenue', 108, '#5B912D');
var sre150 = new Sect('sre', 'Improved Revenue', 120, '#5B912D');
var sre = new Sect('sre', 'Others', 93, '#5B912D');
// sex
var sex50 = new Sect('sex', 'Total Expense', 50, '#C9342F');
var sex30 = new Sect('sex', 'Total Expense', 35, '#C9342F');
var sex = new Sect('sex', 'Other Expenses', 18, '#C9342F');

var ssu = new Sect('ssu', 'Supplier Cost', 30, '#933304');
var srs = new Sect('srs', 'Reseller Cost', 40, '#EF6C5A');
var ssr = new Sect('ssr', 'Reseller Earning', 40, '#5B912D');


// return {  id, name, type, deps, sections }
function GroupData() {
    var sections = Array.from(arguments);
    var group = sections[0];
    sections.splice(0, 1);

    this.id = group.id;
    this.name = group.name;
    this.type = group.type;
    this.deps = group.deps;
    this.sections = sections;
}

// return { name, groups: [{id, name, type}], sections: [{id, groupId, name, value, startVal}] }
function StepData() {
    var groups = Array.from(arguments);
    this.name = groups[0];
    groups.splice(0, 1);
    this.groups = groups.map( g => ({ id: g.id, name: g.name, type: g.type }) );
    var sections = groups.reduce(function (acc, g) {
        var current = 0;
        return acc.concat(g.sections.map(function (s) {
            current += s.value;
            return { 
                id: s.id, 
                groupId: g.id, 
                name: s.name, 
                value: s.value, 
                color: s.color,
                startVal: current - s.value
            };
        }));

    }, []);

    // automatically add profit sections
    var usIncome = d3.sum(sections.filter( s => s.groupId === 'usr' ), d => d.value ) - d3.sum(sections.filter( s => s.groupId === 'use' ), d => d.value );
    if (groups.find( g => g.id === 'usp' )) {
        var prous = new Sect('prous', 'Earning', usIncome * 0.74, '#0077B5');
        var taxus = new Sect('taxus', 'Tax', usIncome * 0.26, '#C73774');
        prous.groupId = 'usp';
        prous.startVal = 0;
        taxus.groupId = 'usp';
        taxus.startVal = prous.value;
        sections.push(prous);
        sections.push(taxus);
    }
    var irIncome = d3.sum(sections.filter( s => s.groupId === 'irr' ), d => d.value ) - d3.sum(sections.filter( s => s.groupId === 'ire' ), d => d.value );
    if (groups.find( g => g.id === 'irp' ) && irIncome > 0) {
        var proir = new Sect('proir', 'Earning', irIncome * 0.9995, '#0077B5');
        var taxir = new Sect('taxir', 'Tax', irIncome * 0.05, '#C73774');
        proir.groupId = 'irp';
        proir.startVal = 0;
        taxir.groupId = 'irp';
        taxir.startVal = proir.value;
        sections.push(proir);
        sections.push(taxir);
    }

    var sear = new Sect('sear', 'Global Earning', usIncome * 0.74 + irIncome * 0.9995, '#0077B5');
    sear.groupId = 'ear';
    sear.startVal = 0;
    sections.push(sear);

    this.sections = sections;
}

var chartSteps = [
    new StepData('Apple US', 
            new GroupData(apg),
            new GroupData(ear),
            new GroupData(apu),
            new GroupData(usr, sre108),
            new GroupData(use, sex50),
            new GroupData(usp)),

    new StepData('Apple US', 
            new GroupData(apg),
            new GroupData(ear),
            new GroupData(apu),
            new GroupData(usr, sre108),
            new GroupData(use, sex50),
            new GroupData(usp)),

    new StepData('Increase revenue', 
            new GroupData(apg),
            new GroupData(ear),
            new GroupData(apu),
            new GroupData(usr, sre150),
            new GroupData(use, sex50),
            new GroupData(usp)),

    new StepData('Decrease expense', 
            new GroupData(apg),
            new GroupData(ear),
            new GroupData(apu),
            new GroupData(usr, sre108),
            new GroupData(use, sex30),
            new GroupData(usp)),

    new StepData('Fiscal Analysis', 
            new GroupData(apg),
            new GroupData(ear),
            new GroupData(apu),
            new GroupData(usr, sip, sre),
            new GroupData(use, sipd, ssu, sex),
            new GroupData(usp)),

    new StepData('Offshore Company', 
            new GroupData(apg),
            new GroupData(ear),
            new GroupData(apu),
            new GroupData(usr, sip, sre),
            new GroupData(use, sipd, ssu, sex),
            new GroupData(usp),
            new GroupData(api),
            new GroupData(irr),
            new GroupData(ire),
            new GroupData(irp)),

    new StepData('IP Sharing', 
            new GroupData(apg),
            new GroupData(ear),
            new GroupData(apu),
            new GroupData(usr, sre),
            new GroupData(use, ssu, sex),
            new GroupData(usp),
            new GroupData(api),
            new GroupData(irr, sip),
            new GroupData(ire, sipd),
            new GroupData(irp)),

    new StepData('Supplier Expense', 
            new GroupData(apg),
            new GroupData(ear),
            new GroupData(apu),
            new GroupData(usr, sre),
            new GroupData(use, srs, sex),
            new GroupData(usp),
            new GroupData(api),
            new GroupData(irr, sip, ssr ),
            new GroupData(ire, sipd, ssu),
            new GroupData(irp)),
    ];

var groupHeight = 50;
var groupX = width / 3;
var sectionHeight = 30;
var groupScale = d3.scale.ordinal().domain(['apg', 'ear', 'apu', 'usr', 'use', 'usp', 'api', 'irr', 'ire', 'irp'])
groupScale.range(d3.range(50, 51 + groupHeight * 10, groupHeight));

var sectionScale = d3.scale.linear().domain([0, 150]).range([groupX + 20, width - 100]);

function renderChartStep(step) {
    var groups = chart.selectAll('.group').data(step.groups, d => d.id);

    groups.enter().append('text').attr('class', 'group');

    // group enter + update
    groups.text( d => d.name ).attr('x', groupX).attr('text-anchor', d => d.type === 'lab' ? 'start' : 'end' )
        .style('font-weight', d => d.type === 'lab' ? 'bold' : 'normal' )
        .transition().attr('y', d => groupScale(d.id) );

    groups.exit().remove();

    var sections = chart.selectAll('.section').data(step.sections, d => d.id);

    var sectionsEnter = sections.enter().append('g').attr('class', 'section');
    sectionsEnter.append('rect').attr('fill', d => d.color )
        .attr('x', d => sectionScale(d.startVal) ).attr('y', d => groupScale(d.groupId) - sectionHeight*2/3 )
        .attr('width', 0).transition()
        .attr('width', d => sectionScale(d.value + d.startVal) - sectionScale(d.startVal) ).attr('height', sectionHeight);
    sectionsEnter.append('text').text( d => d.name ).attr('text-anchor', 'middle').attr('fill', d => d.color )
        .attr('y', d => groupScale(d.groupId) + sectionHeight*2/3 + 2)
        .attr('x', d => (sectionScale(d.value) + sectionScale(d.startVal)) / 2 );

    // sections enter + update
        sections.select('rect').transition().duration(1000)
            .attr('x', d => sectionScale(d.startVal) ).attr('y', d => groupScale(d.groupId) - sectionHeight*2/3 )
            .attr('width', d => sectionScale(d.value + d.startVal) - sectionScale(d.startVal) ).attr('height', sectionHeight);
        sections.select('text').transition().duration(1000)
            .attr('y', d => groupScale(d.groupId) + sectionHeight*2/3 + 2)
            .attr('x', d => (sectionScale(d.value + d.startVal) + sectionScale(d.startVal)) / 2 );

    sections.exit().remove();
}
