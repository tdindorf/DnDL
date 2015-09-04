// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//   DnDL7      +++ code common to all interactive files, uploaded into SVGs +++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	var SvgRootName = null;	//****** INTERNAL_INIT ******//"mainSVG"
	var SVGAreaName = null;	//****** INTERNAL_INIT ******// = "page1"

	var pxScale = 50;		//****** INTERNAL_INIT ******

	var answrElName = null;	//****** INTERNAL_INIT ******// for DnD questions
	var bolHasYpart = false;	//****** INTERNAL_INIT ******// for XY DnD questions
	var bolHideAnswer = false;	//****** INTERNAL_INIT ******// for pure DnD questions
	var bolPolar = 0;	//****** INTERNAL_INIT ******// polar or cartesian
	var bolPol = 0;

	var ym = [];
	var hRays = [];
	var vector = {start:{x:0,y:0},end:{x:0,y:0}};	// e.g.	vector.start.x

	var DragTarget = null;	// for 'if (DragTarget)' in 'Drag'
	var TargetColor = null, TargetStroke = null;
	var offsetX = 0;
	var offsetY = 0;

	var svgNS = null;		// = "http://www.w3.org/2000/svg";
	var xo, yo, xi, yi, xr, yr, dym;
 	var rayLength = null;
	var arcRadius = null;

	var bolSubmitted  = false;	// to edit or not to edit
	var bolAnswrEl = false;	// use target data for XY answer values
	var answrEl = null;

	var pNode = null, pNodeNext = null;
	var currentID = null, nextID = null;
	var answerFld = null, answerFldNext = null;

	var p = null;		//****** _INIT ******
	var BackDrop = null;	//****** _INIT ******
	var tooltip_txt = null;	//****** _INIT ******
	var tooltip_bg = null;	//****** _INIT ******

function Init(evt) {

	p = document.getElementById(SvgRootName).createSVGPoint();
	BackDrop = document.getElementById('BackDrop');

	tooltip_txt = document.getElementById('tooltip_txt');
	tooltip_bg = document.getElementById('tooltip_bg');

	internal_Init(evt);
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 		++++++++++  GUI ++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function moveTarget (e, x, y) {	// if target is a circle or not
	var xyprefix = (e.tagName == 'circle' ? 'c' : '');
		e.setAttributeNS(null, xyprefix +'x', x - offsetX);
		e.setAttributeNS(null, xyprefix +'y', y - offsetY);
		// if tooltip, drag it too
	updateLine(e , x , y);	// if other changes needed
	}

function grabLook (e) {		// store appearance, then alter
		TargetColor = e.getAttributeNS(null, 'fill');
		TargetStroke = e.getAttributeNS(null, 'stroke');
		e.setAttributeNS(null, 'stroke', 'black');
		e.setAttributeNS(null, 'fill', 'yellow');
	}

function dropLook (e) {		// reset to pre-Grab appearance
		e.setAttributeNS(null, 'stroke', TargetStroke);
		e.setAttributeNS(null, 'fill', TargetColor);
	}

function Grab(evt) {		// fire on mouse down
	if (hasClass(evt.target, 'protected')) {
		return;
		}
	DragTarget = evt.target;
	saveOffset(DragTarget);
	bolAnswrEl = (DragTarget == answrEl ? true : false);
	grabLook (DragTarget ); // change apprnc when selctd
	}

function Drag(evt) {		// fire on mouse move
	GetTC(evt);
	if (DragTarget) {
		moveTarget (DragTarget, p.x, p.y);
		         if (bolAnswrEl && !bolSubmitted) {
			updateInput(answerFld, answerFldNext, bolPolar);
			}
		}
	}

function Drop(evt) {		// fire on mouse up
	if (DragTarget) {
		dropLook (DragTarget ); // reset appearance
		//if (bolAnswrEl) {
			//showPosition(p.x, p.y)
			//};
		   // DragTarget.setAttributeNS(null, 'pointer-events', 'all');
		DragTarget = null;
		}
	}

function GetTC(evt) {
		p.x = evt.clientX;
		p.y = evt.clientY;
	var CTM = document.getElementById(SVGAreaName).getScreenCTM();
		p = p.matrixTransform(CTM.inverse());
	}

function saveOffset(e){
	var xyprefix = (e.tagName == 'circle' ? 'c' : '');
	var eX = e.getAttributeNS(null, xyprefix +'x');	//'x' position of Target
	var eY = e.getAttributeNS(null, xyprefix +'y');
	offsetX = p.x - eX;				// difference between cursoe and 'x'
	offsetY = p.y - eY;
	}

function showPosition(x, y) { 
// used for testing with alerts ( vs. continuous output)

	//var x = Math.round(p.x/5)/10;
	//var y = Math.floor(p.y/5)/10;
        	var angle = r2d(Math.atan2(y, x));
	//var z = 1000*Math.abs(x) + Math.abs(y)
		alert ('angle : ' + Math.round(angle));
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 			++++++++++  tooltip +++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function ShowTooltip(evt, text) {
	tooltip_txt = document.getElementById('tooltip_txt');
	tooltip_bg = document.getElementById('tooltip_bg');
	//alert('tooltip');
	tooltip_txt.textContent = text;
	//tooltip_txt.firstChild.data = text;
	tooltip_txt.setAttributeNS(null,"visibility", "visible");

	var length = tooltip_txt.getComputedTextLength();
	tooltip_bg.setAttributeNS(null,"width", length+5);
	tooltip_bg.setAttributeNS(null,"visibility", "visibile");
	GetTC(evt);
	moveToolTip(p.x, p.y);
	}

function moveToolTip(x, y) {
	tooltip_txt.setAttributeNS(null,"x", x-18);
	tooltip_txt.setAttributeNS(null,"y", -(y +20));
	tooltip_bg.setAttributeNS(null,"x", x-20);
	tooltip_bg.setAttributeNS(null,"y", y+14);
	}

function HideTooltip(evt) {
	tooltip_txt.setAttributeNS(null,"visibility","hidden");
	tooltip_bg.setAttributeNS(null,"visibility","hidden");
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 			++++++++++++ axes +++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function createTxt(txt,tx,ty,axis,pxScale) {
	svgNS = "http://www.w3.org/2000/svg";
	var newEl = document.createElementNS(svgNS,"text");
     		newEl.setAttributeNS(null,"x",tx*pxScale);		
      		newEl.setAttributeNS(null,"y",ty*pxScale);
     		newEl.textContent=txt;
      		newEl.setAttributeNS(null,"pointerevents","none");
	document.getElementById("scale"+axis).appendChild(newEl);
	}

function placeTxt(xmin, xmax, ymin, ymax){
	for (var i=xmin; i<=xmax; i++){
   	 	createTxt(i, i, 0,"X", pxScale);
		}
	for (i=ymin; i<=ymax; i++){
   	 	createTxt(i, 0, -i,"Y", pxScale);
		}
	}

function placeF (f) {
	var places = [-1,1];
	for (var i in places){
	var elem_F = document.createElementNS("http://www.w3.org/2000/svg","text");
		elem_F.textContent = 'F';
		elem_F.setAttributeNS(null, "y", -5);
		elem_F.setAttributeNS(null, "fill", 'black');
		elem_F.setAttributeNS(null, "x", places[i]*f*pxScale);
		elem_F.setAttributeNS(null, 'transform', "scale(1 -1)");
	document.getElementById(SVGAreaName).appendChild(elem_F);

	var elem_Mark = document.createElementNS(svgNS,"path");
		elem_Mark.setAttributeNS(null, "d", 'M ' + places[i]*f*pxScale + ' -4 v 8 m -4 -4 h 8');
		elem_Mark.setAttributeNS(null, "stroke", "black");
	document.getElementById(SVGAreaName).appendChild(elem_Mark);
		}
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 	++++++++++++++++++ ray tracing plugins ++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function checkForRayGroups() {
	svgNS = "http://www.w3.org/2000/svg";
	var svgPage = document.getElementById(SVGAreaName);
	var newGrp = document.createElementNS(svgNS, 'g');

	var rayGrps = ['raysI' , 'raysR'  , 'raysV', 'hRtraceLines'];
	var rayStrks = ['green' , 'blue'  , 'grey' , 'grey'];
	var rayStrkDshArr = [0 , 0, '5, 5', '3, 8'];

 	for (var i in rayGrps) {
		if ( document.getElementById(rayGrps[i]) ) {
		//alert(rayGrps[i]  + ' found')
		} else { 
		newGrp.setAttribute("id", rayGrps[i]);
		newGrp.setAttribute("stroke", rayStrks[i]);
		if (rayStrkDshArr[i]) {
			newGrp.setAttribute("stroke-dasharray", rayStrkDshArr[i]);
			}
		svgPage.appendChild(newGrp);
			}
		}

	if ( document.getElementById("hRendPoints") ) {
		//alert(rayGrps[i]  + ' found')
		} else { 
		newGrp.setAttribute("id", "hRendPoints");
		newGrp.setAttribute("stroke", 'green');
		newGrp.setAttribute("fill", 'green');

		svgPage.appendChild(newGrp);
		}

	}

function addHRays(number, xStart, xEnd, yStart){
	svgNS = "http://www.w3.org/2000/svg";
	var hRaysGrp = document.getElementById("hRendPoints");
	var hTracesGrp = document.getElementById("hRtraceLines");
	var newEl;

	for (var j=0; j<=number-1; j++){
	var nR = {
		vRayNum: j, 
		start:	{x : xStart, y : yStart+20*j},
		end:	{x : xEnd, y : yStart+20*j},
		};
		hRays.push(nR);

	newEl = document.createElementNS(svgNS,"circle");
  		newEl.setAttributeNS(null,"id","Cir" + hRays[j].vRayNum + "1");		
      		newEl.setAttributeNS(null,"cx", hRays[j].start.x);
     		newEl.setAttributeNS(null,"cy", hRays[j].start.y);
     		newEl.setAttributeNS(null,"r", 5);	
	hRaysGrp.appendChild(newEl);

	newEl = document.createElementNS(svgNS,"circle");
  		newEl.setAttributeNS(null,"id","Cir" + hRays[j].vRayNum + "2");		
      		newEl.setAttributeNS(null,"cx", hRays[j].end.x);
     		newEl.setAttributeNS(null,"cy", hRays[j].end.y);
     		newEl.setAttributeNS(null,"r", 5);
	hRaysGrp.appendChild(newEl);

	newEl = document.createElementNS(svgNS,"line");
    	newEl.setAttributeNS(null,"id","trace"+hRays[j].vRayNum);
    	newEl.setAttributeNS(null,"x1", hRays[j].start.x);
    	newEl.setAttributeNS(null,"x2", hRays[j].end.x);
    	newEl.setAttributeNS(null,"y1", hRays[j].start.y);
    	newEl.setAttributeNS(null,"y2", hRays[j].end.y);
		hTracesGrp.appendChild(newEl);
		}
	}

function drawRayDiagram(rayN, bIn, bRe, bVi, bHideJ0) {
	bHideJ0 = (bHideJ0 || 0);
	fixBoundaryPoints(rayN);
	drawRays(rayN, bIn, bRe, bVi, bHideJ0);
		}

function drawRays(rayN, bIn, bRe, bVi, bHideJ0) {
	svgNS = "http://www.w3.org/2000/svg";
	var iRaysGrp = document.getElementById("raysI");
	var rRaysGrp = document.getElementById("raysR");
	var vRaysGrp = document.getElementById("raysV");
	var path;
	var newRay;
	var rayArPos = 0.8; // for arrow-mid marker
  
	for (var j = 0 ; j < rayN ; j++) {	// START OF FOR
	
	// caculate yr, xr : end of ref... ray
	if (typeof rayLength == 'number') {
		var angImage = Math.atan2((ym[j]-yi), -xi);	// fixed (xm[j]=0)-xi
		yr = AtoXY(r2d(angImage), rayLength*pxScale).y;
		xr = AtoXY(r2d(angImage), rayLength*pxScale).x;	// fixed (xm[j]=0)-xi
		} else {
		yr = (ym[j]-yi)*(xr/-xi);		// legacy compatibility
		}

	// draw Incident ray
	newRay = document.createElementNS(svgNS,"path");
     	newRay.setAttributeNS(null,"id","rI"+j);
		path = "M " + xo + " " + yo + " L " + 
			(1-rayArPos)*xo + " " + 
			(yo+rayArPos*(ym[j]-yo)) + " 0 " + ym[j];	
		newRay.setAttributeNS(null, "d", path);
	if (bIn) {
		iRaysGrp.appendChild(newRay);
  		}

	// draw Ref.. ray
	newRay = document.createElementNS(svgNS,"path");
     	newRay.setAttributeNS(null,"id","rR"+j);		
		path="M 0 " + ym[j] + " l " + (1-rayArPos)*xr + " " + (1-rayArPos)*yr + " " +  xr + " " +  yr;
		newRay.setAttributeNS(null, "d", path);
	if (bRe && !(bHideJ0 &&  j == 0)) {		// hide only 0th ray, if bHideJ0 = 1
		rRaysGrp.appendChild(newRay);
		}

	// draw Virtual ray
	newRay = document.createElementNS(svgNS,"path");
     	newRay.setAttributeNS(null,"id","rR"+j);		
		path= "M " + xi + " " + yi + " L 0 " + ym[j];
		newRay.setAttributeNS(null, "d", path);
	if (bVi) {
		vRaysGrp.appendChild(newRay);
		}
		}	// END OF FOR
	}

function drawArc (angle, arcRadius, arcName, blShowLabel, yOffset) {
	yOffset = (yOffset || 0);
	blShowLabel = (blShowLabel || 0);
	var xa = AtoXY(angle, arcRadius).x;	// arc point on ray, x-ccordinate
	var ya = AtoXY(angle, arcRadius).y + yOffset ;	// arc point on ray, y-ccordinate

	var xLa = AtoXY(angle/2, arcRadius+15).x;	// arc label, x-ccordinate
	var yLa = AtoXY(angle/2, arcRadius+15).y + yOffset ;	// arc label, y-ccordinate

	var el = document.getElementById("angle_"+ arcName) ;		// draw arc
		var flags = ( angle > 0 ? ' 0 0 1 ' : ' 0 0 0 ');
		var acrPath = "M " + arcRadius  +  " " + yOffset  + " A " + arcRadius + 
		" " + arcRadius + flags + xa + " " + ya ;
		el.setAttributeNS(null, "d", acrPath );

	if (blShowLabel) {
		el = document.getElementById("label_"+ arcName) ;		// label arc
		el.setAttributeNS(null, "transform", "translate(" + xLa + " " + yLa + ")  scale(1 -1)" );

		el.textContent = Math.round(angle) + "°";
		}
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 		++++++++++++  INPUT functions ++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function getXoYo () {
	xo = ( typeof xo == 'number' ? xo*pxScale : (2+Math.round(Math.random() *2))*pxScale );
	yo = ( typeof yo == 'number' ? yo*pxScale : (2-Math.round(Math.random()*4))*pxScale );
	}

function getXiYi () {
	xi = ( typeof xi == 'number' ? xi*pxScale : -xo );
	yi = ( typeof yi == 'number' ? yi*pxScale : yo );
	}

function getYm0 () {
	ym[0] = ( typeof ym[0] == 'number' ? ym[0]*pxScale : (Math.round(1.5-Math.random()*3))*pxScale );
	}

function getXr () {
	if (typeof rayLength == 'number') {
		xr = rayLength;
		//rayLength = (xi*xo > 0 ? rayLength : -rayLength);	// if i o same side, away from image
	} else {
	xr = (typeof xr == 'number' ? xr*pxScale : 1.5*pxScale );
		}
	}

function getDym () {
	dym = ( typeof dym == 'number' ? dym*pxScale : 0.6*pxScale );
	}

function fixBoundaryPoints(rayN){
	getXoYo ();
	getXiYi ();
	getYm0 (); 
	getXr ();
	getDym ();

	//var dym = 0.6;	//separation of impact points
	//dym  = (typeof dym  == 'number' ? dym  : 0.6);
	var s = 1, k = 1, f = 1;
	while (k < rayN) {
		ym[k] = (typeof ym[k] == 'number' ? ym[k]*pxScale : ym[0] + s*f*dym);
		//ym[k] = ym[0] + s*f*dym;
		s = -s;
		k = k + 1;
		f = Math.ceil(k/2);
		}
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++ reveal and show, not needed with 'bolean: +++++++++++++++
// ++  bIn = true, bRe = true , bVi = true;  ImgVsbl = false ; //visible rays ++
// drawRayDiagram(rayN, 0 | bISubmitted | 1 , 0 | bISubmitted | 1 , 0 | bISubmitted | 1  ) ++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	/*if(ImgVsbl){
	var ob = document.getElementById("imagePoint");	// 'imagePoint'
		ob.setAttributeNS(null, "cx", xi);
		ob.setAttributeNS(null, "cy", yi);
		ob.setAttributeNS(null, "fill", "red");
		}

function showVirtual(){        // shows virtual rays and image after submit
	var ob = document.getElementById("raysV");
      ob.setAttributeNS(null, "stroke", "grey");
	}*/

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++  functions that interact with OTHER elements on THIS page +++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function establishXYquestionParts(name, bLookforY) {	// find pNode and pN-Next, if they exists;
	bLookforY = bLookforY || false;
	pNode = findParentQuestion(name, 'q');    // find parent
	if (pNode) { 
		answerFld  = pNode.querySelector("input[type=text]");
		bolSubmitted   = (answerFld.hasAttribute("readonly") ? true : false);
	// find next question if part of an XY pair
		if (bLookforY) {
			pNodeNext = (document.getElementById(nextID) ? document.getElementById(nextID) : null); 
			}
	//alert (pNodeNext);
		answerFldNext  = (pNodeNext ? pNodeNext.querySelector("input[type=text]") : null);
		plotPrevious (answrEl, answerFld, answerFldNext, bolPolar);
		if (bolHideAnswer) {
			hideAnswerFlds(answerFld, answerFldNext);
			}
		}	//end of 'if (pNode)' 
	}

function findParentQuestion(SVGName, predicate) {
	var counter = 1;
	var a = document.getElementById(SVGName);
	var id_name = "";
	while (a) {
		id_name = (a.hasAttribute("id") ? a.getAttributeNode("id").value : 'none');
		if (id_name.substring(0,predicate.length) == predicate) {
			currentID = id_name;
			nextID = 'q' + (parseInt(id_name.substring(1,id_name.length)) + 1);
			return a;
			}
		a = a.parentNode;
		counter ++;
		if (counter>20) {
			//alert('Not found after 20');
			return null;
			}
		}
	}

function plotPrevious (e, ansFldX, ansFldY, bPolar) {
	bPolar = (bPolar || false);
	var x, y, angle;
	var xyprefix = (e.tagName == 'circle' ? 'c' : '');
		x = e.getAttributeNS(null, xyprefix +'x');
  		y = e.getAttributeNS(null, xyprefix +'y');
	if (bPolar) {				// if polar: 1 field, angle to x y
		angle = (ansFldX.value !=="" ? stripUnits(ansFldX.value) : 0);

		var radius = Math.sqrt(x*x + y*y);	// use original ray's px length
		x = AtoXY (angle, radius).x;
		y = AtoXY (angle, radius).y + ym[0]*pxScale;      // !!! yoffset !!!

		} else {				// if cartesian, 1 field: x
		x = (ansFldX.value !=="" ? ansFldX.value*pxScale : x);
			if (ansFldY) {		// if cartesian, 2nd field: y
		y = (ansFldY.value !=="" ? ansFldY.value*pxScale  : y);
    			}
		}
	e.setAttributeNS(null, xyprefix +'x', x);		// place point
	e.setAttributeNS(null, xyprefix +'y', y);
	if (bPolar) {
		updateLine(e , x , y);		// add ray to point
		updateArc(x, y);			// add arc to ray
		}
	}

function placeElement (e, x, y) {
	x = (x || 0);
	y = (y || 0);
	if (typeof e == 'string')  {
		e = document.getElementById(e);
		}
	var xyprefix = (e.tagName == 'circle' ? 'c' : '');
	if (e.hasAttribute(xyprefix +'x')) {
		e.setAttributeNS(null, xyprefix +'x', x);
		}
	if (e.hasAttribute(xyprefix +'y')) {
		e.setAttributeNS(null, xyprefix +'y', y);
		}
	}

function updateInput(ansFldX, ansFldY, bPolar ){
	bPolar = (bPolar || false);	// enter into input field(s); 1st: angle or x
	if (ansFldX) {
		ansFldX.value = (bPolar ? Math.round(XYtoA (p.x, p.y-ym[0])) + '°' : Math.round(10*p.x/pxScale)/10);
		}
	if (ansFldY) {		// if 2nd: y
		ansFldY.value = Math.round(10*p.y/pxScale)/10;
		}
	}

function fillAnswer(el) {		// adds color to dragged element
	var ansColor = 'null';
	if (hasClass(answerFld, 'incorrect')) {
		ansColor = '#faa';
		} else if (hasClass(answerFld, 'correct'))  {
		ansColor = '#afa';
		}
	if (ansColor) {
		el.setAttributeNS(null, 'fill', ansColor );
		} else {
		return;
		}
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 		++++++++++++++ hide functions ++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function hideAnswerFlds(ansFldX, ansFldY) {
	hideElement(ansFldX);		// hide answer field
	hideElementLabel(ansFldX.id);	// hide answer fieldlabel

	if (ansFldY) {
		hideElement(ansFldY);	
		hideElementLabel(ansFldY.id);
		}  
	}

function hideElement(element){
	element.type="hidden";
	}

function hideElementLabel(for_ID) {              // find label 'for...', then hide it
	var labels = document.getElementsByTagName('LABEL');
	for (var i = 0; i < labels.length; i++) {
		if (labels[i].htmlFor == for_ID) {
			labels[i].innerHTML = "";
			}
		}
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 		+++++++++++++++++ general utilities +++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function r2d_r(a) {		//  angle in radians // in case still used
	return Math.round(180*a/Math.PI);
	}

function r2d(a) {		//  angle in radians
	return (180*a/Math.PI);
	}

function d2r(a) {		//  angle in degrees
	return (Math.PI*a/180);
	}

function XYtoA (x, y) {	// gives angle in degrees
	var A = r2d(Math.atan2(y, x));
	return A;
	}

function AtoXY (angle, radius) {	//  angle in degrees
	radius = radius || 1;
	var q = {};
	q.x = radius*Math.cos(d2r(angle));
	q.y = radius*Math.sin(d2r(angle));
	return q;
	}

function hasClass(el, cn){		// if (!hasClass(evt.target, 'protected'))
	var classes = el.classList;
		for(var j = 0; j < classes.length; j++){
		if(classes[j] == cn){
			return true;
			}
		}
	return false;
	}

function stripUnits (txt) {
	return txt.replace(/[A-Za-z°]+/, '');
	}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
