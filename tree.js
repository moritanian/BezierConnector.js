var Tree = {

	getInstance: function(container, width, height){

		let svgContainer = document.createElement("div");

		svgContainer.classList.add("svg-container");

		container.appendChild( svgContainer );

		let elementContainer = document.createElement("div");

		elementContainer.style.width = `${width}px`;

		elementContainer.style.height = `${height}px`;

		elementContainer.classList.add("element-container");

		container.appendChild( elementContainer );

		let containerRect = container.getBoundingClientRect();

		connector = new Bezier();

		connector.init( svgContainer, width, height );


		function Tree(element){

			this.element = element;

			this.container = container;

			this.elementContainer = elementContainer;

			this.svgContainer = svgContainer;

			this.connector = connector;

			this.containerRect = containerRect;


			this.elementContainer.appendChild( element );

			this.connector.draggable( element );

			this.children = [];

			this.parent = null;			

		}

		Tree.prototype.append = function(element){

			var child;

			if( element instanceof Tree){

				child = element;
			
			} else {

				child = new Tree(element);
			}
			
			this.children.push(child);

			child.parent = this;

			child.connectInfo = this.connector.connect({
				from: this.element,
				to: child.element
			});

			return child;
				
		};

		Tree.fromArray = function(array){

			let root, tree;

			for(let i=0; i<array.length; i++){
				
				if(i == 0){
					
					root = tree = new Tree(array[i], connector);
				
				} else {

					tree.append( array[i] );
				
				}


			}

			return root;
		};

		Tree.prototype.getRoot = function(){

			if( this.parent === null){

				return this;

			}

			return this.parent.getRoot();

		};

		Tree.prototype.hasChildren = function(){

			return this.getChildrenNum() > 0;

		};

		Tree.prototype.optimize = function(){

			this.callRecursively( t => t.optimizeElement() );

		};

		Tree.prototype.optimizeElement = function(){

			const IntervalLeft = 20;
			const IntervalTop = 20;

			let left = IntervalLeft/2, top = IntervalTop/2;

			if( !this.hasParent() ){

				this.element.style.left = `${left}px`;

				this.element.style.top = `${top}px`;

				return ;

			}


			let parent = this.getParent();

			let parentRect = parent.element.getBoundingClientRect();
			
			let myRect = this.element.getBoundingClientRect();

			left = parentRect.left + parentRect.width + IntervalLeft - this.containerRect.left;
			
			let currentIndex = this.getChildIndex();

			if(currentIndex == 0){

				top = parentRect.top- this.containerRect.top;
			
			} else {

				let end = parent.getChild( currentIndex - 1).getNewestEnd();

				let endRect =  end.element.getBoundingClientRect();

				top = endRect.top + endRect.height + IntervalTop - this.containerRect.top;

			}

			if( left + myRect.width > width ){

				left = IntervalLeft;

				top += myRect.height + IntervalTop;

			}


			this.element.style.left = `${left}px`;

			this.element.style.top = `${top}px`;

			if( this.connectInfo ){

			 	this.connector.updateCurve( this.connectInfo );

			}

		};

		Tree.prototype.callRecursively = function(lambda){

			lambda(this);

			if( !this.hasChildren() ){
				return;
			}

			this.children.forEach( c => c.callRecursively(lambda) );

		};

		Tree.prototype.hasParent = function(){

			return !!this.parent;

		};

		Tree.prototype.getParent = function(){

			return this.parent;

		};

		Tree.prototype.getChild = function(index){

			return this.children[index];

		};

		Tree.prototype.getChildrenNum = function(index){

			return this.children.length;

		};

		Tree.prototype.getChildIndex = function(){

			return this.parent.children.indexOf(this);
			
		};


		// #TODO
		Tree.prototype.collapse = function(){

		};

		Tree.prototype.collapseAll = function(){

			while (this.svgContainer.firstChild) {
		    	this.svgContainer.removeChild(this.svgContainer.firstChild);
			}

			while (this.container.firstChild) {
		    	this.container.removeChild(this.container.firstChild);
			}

		};

		Tree.prototype.getNewestChild = function(){

			if( !this.hasChildren()){

				return null;
			
			}

			return this.getChild( this.getChildrenNum() - 1 );

		};

		Tree.prototype.getNewestEnd = function(){

			if( !this.hasChildren() ){

				return this;

			}

			return this.getNewestChild();
			
		};

		return Tree;

	}
};

