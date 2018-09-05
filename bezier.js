function Bezier(){

	this.init = function($container, width = 800, height = 800){

		this.$svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		this.$svg.setAttribute( 'width', width);
		this.$svg.setAttribute( 'height', height);

		$container.appendChild( this.$svg );

		this.containerReact = $container.getBoundingClientRect();

		this._curveList = [];

	};

	this.connect = function(elements, option={}){
		
		let curveInfo = {
			$from: elements.from,
			$to: elements.to,
			option: option
		};

		this._getTargetDrag$(curveInfo.$from).subscribe( e => {
			this.updateCurve( curveInfo );
		});

		this._getTargetDrag$(curveInfo.$to).subscribe( e => {
			this.updateCurve( curveInfo );
		});
		
		this._createCurve( curveInfo );

		this.$svg.appendChild(curveInfo.$element);

		this._curveList.push( curveInfo );

		return curveInfo;

	};

	this._getStartPoint = function($from, option={}){

		var fromRect = $from.getBoundingClientRect();

		return {
			x: fromRect.left + fromRect.width - this.containerReact.left,
			y: fromRect.top + fromRect.height / 2.0 - this.containerReact.top 
		};

	};

	this._getEndPoint = function($to, option={}){

		var toRect = $to.getBoundingClientRect();

		return {
			x: toRect.left - this.containerReact.left,
			y: toRect.top + toRect.height / 2.0  - this.containerReact.top 
		};
		
	};

	this._getCurvePoints = function(start, end){

		if(start.x < end.x){

			return [
				{x: start.x, y: start.y},		
				{x: (start.x + end.x) / 2.0, y: start.y},	
				{x: (end.x + start.x) / 2.0, y: end.y},	
				{x: end.x, y: end.y},		
			];

		} else {

			return [
				{x: start.x, y: start.y},		
				{x: start.x + (start.x - end.x) / 2.0, y: start.y},	
				{x: end.x + (end.x - start.x) / 2.0, y: end.y},	
				{x: end.x, y: end.y},		
				
			];
		
		}		

	};

	this._createCurve = function(curveInfo){

		curveInfo.$element = document.createElementNS("http://www.w3.org/2000/svg","path");  

		curveInfo.$element .setAttribute("class", "curves");

		this.updateCurve(curveInfo);

		return curveInfo;

	};

	this.updateCurve = function(curveInfo){

		let start = this._getStartPoint(curveInfo.$from, curveInfo.option);
		let end = this._getEndPoint(curveInfo.$to, curveInfo.option);
		curveInfo.points = this._getCurvePoints(start, end);

		let points = curveInfo.points;
		let $curve = curveInfo.$element;
		var d =  [
	        'M', points[0].x, ' ', points[0].y,
	        'C', points[1].x, ' ', points[1].y,
	        ' ', points[2].x, ' ', points[2].y,
	        ' ', points[3].x, ' ', points[3].y,
	      ].join('');

		$curve.setAttribute("d", d);
		return $curve;

	};

	this.disconnect = function(curveInfo){

		this.$svg.removeChild( curveInfo.$element );

	};

	// #TODO cache
	this._getTargetDrag$ = function($elem){
		
		let mmove$ = rxjs.fromEvent(document, 'mousemove');
		let mup$ = rxjs.fromEvent(document, 'mouseup');

		let mdown$ = rxjs.fromEvent($elem, 'mousedown');

		let drag$ = mmove$
		    .pipe( rxjs.operators.map( e => {e.preventDefault(); return e;}) )
		    .pipe( rxjs.operators.takeUntil( mup$ ));

		let getPosition = downEvent => drag$.pipe( 
			rxjs.operators.map( moveEvent => {
				return {
					'left': moveEvent.clientX - downEvent.offsetX - this.containerReact.left,
					'top': moveEvent.clientY - downEvent.offsetY - this.containerReact.top
				};
			})
		);

		 return mdown$
			.pipe( rxjs.operators.flatMap( getPosition )
		);

	} ;

	this.draggable = function($elem){

		let targetDrag$ = this._getTargetDrag$($elem);

		targetDrag$.subscribe( (pos) => {
		    $elem.style.top = `${pos.top}px`;
		    $elem.style.left = `${pos.left}px`;			
		});

		return targetDrag$;

	};

}