// Libraries
import React from 'react';
import { observer} from 'mobx-react';
import interact from 'interactjs';

// Css
import './Card.css';

// Make it an observer so we can dereference observables in this component and trigger render
@observer
class Card extends React.Component {
	constructor(props) {
		super(props);

		// Refs
		this.cardImageRef = React.createRef();
		this.objectImageRef = React.createRef();

		// Funcs
		this.objImageLoaded = this.objImageLoaded.bind(this);
		this.cardImageLoaded = this.cardImageLoaded.bind(this);
		this.objImageError = this.objImageError.bind(this);
		this.cardImageError = this.cardImageError.bind(this);
	}

	normallizeDenom(denom) {
		if (denom === 'Ace') {
			return 'A';
		} else if (denom === 'King') {
			return 'K';
		} else if (denom === 'Queen') {
			return 'Q';
		} else if (denom === 'Jack') {
			return 'J';
		} else {
			return denom;
		}
	}

	bottomMarginHacky(denom, offset=0) {
		if (denom === 'Queen') {
			return `${(-3 + offset)}px`;
		} else if (denom === 'Jack') {
			return `${(8 + offset)}px`;
		} else if (parseInt(denom, 10) === 10) {
			return `${(-13 + offset)}px`;
		} else {
			return `${(0 + offset)}px`;
		}
	}

	clearImage(ref) {
		if (ref.current) {
			ref.current.src = "";
			ref.current.removeAttribute('style');
			ref.current.removeAttribute('data-xp');
			ref.current.removeAttribute('data-yp');
			ref.current.innerHTML = "";
		}
	}

	clearCardImage() {
		this.clearImage(this.cardImageRef);
	}

	clearObjectImage() {
		this.clearImage(this.objectImageRef);
	}

	imageData(ref) {
		if (ref.current) {
			return {
				image_tx: ref.current.getAttribute('data-xp') || null,
				image_ty: ref.current.getAttribute('data-yp') || null,
				image_h: ref.current.style.height || null,
				image_w: ref.current.style.width || null,
				image_url: ref.current.getAttribute('src') || ''
			}
		} else {
			return null;
		}
	}

	cardImageData() {
		return this.imageData(this.cardImageRef);
	}

	objectImageData() {
		return this.imageData(this.objectImageRef);
	}

	cardImageError() {
	}

	objImageError() {
	}

	// Render is too delayed for large data images, need to change this
	cardImageLoaded() {
		if (this.cardImageRef.current) {
			// Not yet seen (default pos)
			if (this.props.cardImgTx === null) {
				this.cardImageRef.current.setAttribute('data-xp', 0);
				this.cardImageRef.current.setAttribute('data-yp', 0);
			} else {
				this.cardImageRef.current.style.transform = 
				this.cardImageRef.current.style.webkitTransform = 
					`translate(${this.props.cardImgTx}px, ${this.props.cardImgTy}px)`;
				this.cardImageRef.current.setAttribute('data-xp', this.props.cardImgTx);
				this.cardImageRef.current.setAttribute('data-yp', this.props.cardImgTy);
			}

			if (this.props.cardImgH !== null) {
				this.cardImageRef.current.style.height = `${this.props.cardImgH}px`;
				this.cardImageRef.current.style.width = `${this.props.cardImgW}px`;
			} else {
				this.cardImageRef.current.style.height = '';
				this.cardImageRef.current.style.width = '';
			}
		}
	}

	objImageLoaded() {
		if (this.objectImageRef.current) {
			if (this.cardImageRef.current) {
				// Not yet seen (default pos)
				if (this.props.objectImgTx === null) {
					this.objectImageRef.current.style.transform = 
					this.objectImageRef.current.style.webkitTransform = 
						`translate(${20}px, -${this.cardImageRef.current.offsetHeight}px)`;
					this.objectImageRef.current.setAttribute('data-xp', 20);
					this.objectImageRef.current.setAttribute('data-yp', -(this.cardImageRef.current.offsetHeight));
				} else {
					this.objectImageRef.current.style.transform = 
					this.objectImageRef.current.style.webkitTransform = 
						`translate(${this.props.objectImgTx}px, ${this.props.objectImgTy}px)`;
					this.objectImageRef.current.setAttribute('data-xp', this.props.objectImgTx);
					this.objectImageRef.current.setAttribute('data-yp', this.props.objectImgTy);
				}

				if (this.props.objectImgH !== null) {
					this.objectImageRef.current.style.height = `${this.props.objectImgH}px`;
					this.objectImageRef.current.style.width = `${this.props.objectImgW}px`;
				} else {
					this.objectImageRef.current.style.height = '';
					this.objectImageRef.current.style.width = '';
				}
			}
		}
	}

	componentDidMount() {
		interact('.card-image')
		.draggable({
			onmove: (event) => {
			    var target = event.target,
			        // keep the dragged position in the data-x/data-y attributes
			        x = (parseFloat(target.getAttribute('data-xp')) || 0) + event.dx,
			        y = (parseFloat(target.getAttribute('data-yp')) || 0) + event.dy;

			    // translate the element
			    target.style.webkitTransform =
			    target.style.transform =
			      'translate(' + x + 'px, ' + y + 'px)';

			    // update the position attributes
			    target.setAttribute('data-xp', x);
			    target.setAttribute('data-yp', y);
			},
			restrict: {
			  restriction: '.card-div',
			  elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
			},
		})
		.resizable({
			// resize from all edges and corners
			edges: { left: true, right: true, bottom: true, top: true },

			// keep the edges inside the parent
			restrictEdges: {
			  outer: '.card-div',
			  endOnly: true,
			},

			// minimum size
			restrictSize: {
			  min: { width: 50, height: 50 },
			},

			inertia: true,
		})
		.on('resizemove', function (event) {
			var target = event.target;
			target.style.width  = event.rect.width + 'px';
			target.style.height = event.rect.height + 'px';
			target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
		});
	}

	render() {
		let cardRender = <React.Fragment></React.Fragment>;
		if (!this.props.isCardBack && !this.props.isBasic) {
			cardRender = (
				<div className={this.props.klasses} onClick={this.props.clickHandler}>
				  <div className="card-header">
				  	&nbsp;{this.normallizeDenom(this.props.cardDenom)}
				  	<img className="top-suit" alt="card-suit" src={this.props.cardSuitImg}/>
				  </div>
				  <div className="card-body">
				    {this.props.cardTitle ? <h4 className="card-title">{this.props.cardTitle}</h4> : <h4>&nbsp;</h4>}
				    <div className="card-div container">
				    	<div className="row">
				    		<div className="mx-auto card-images-cont">
				    			<img className="card-image card-image-1 img-fluid" onLoad={this.cardImgLoaded} onError={this.cardImgError} src={this.props.cardImg} alt={this.props.cardImgAlt} ref={this.cardImageRef} />
				    			<img className="card-image card-image-2 img-fluid" onLoad={this.objImageLoaded} onError={this.objImgError} src={this.props.action2} alt={this.props.cardImgAlt} ref={this.objectImageRef} />
				    		</div>
				    	</div>
				    </div>
				    <div className="container">
					    <p className="card-text">
					    	{this.props.cardName ? (<React.Fragment><b>Name:</b> {this.props.cardName} <br/></React.Fragment>) : <span>&nbsp;</span>}
					    	{this.props.action1 ? (<React.Fragment><b>Action:</b> {this.props.action1} <br/></React.Fragment>) : <span>&nbsp;</span>}
					    </p>
					</div>
				  </div>
				  <div className="card-footer text-right">
				  	<img className="bottom-suit" alt="card-suit" src={this.props.cardSuitImg}/>
				  	<span style={{marginLeft: this.bottomMarginHacky(this.props.cardDenom)}}>{this.normallizeDenom(this.props.cardDenom)}&nbsp;&nbsp;&nbsp;&nbsp;</span>
				  </div> 
				</div>
			);
		} else if (this.props.isCardBack && !this.props.isBasic) {
			cardRender = (
				<div className={this.props.klasses} onClick={this.props.clickHandler}>
				  <img className="img-fluid" src={this.props.cardImg} alt={this.props.cardImgAlt} />
				</div>
			);
		// Needs adjusting for smaller size
		} else if (!this.props.isCardBack && this.props.isBasic) {
			cardRender = (
				<div className={this.props.klasses} onClick={this.props.clickHandler}>
				  <div className="card-header">
				  	<span className="suit-text-mini">{this.normallizeDenom(this.props.cardDenom)}</span>
				  	<img className="top-suit-mini suit-mini" alt="card-suit" src={this.props.cardSuitImg}/>
				  </div>

				  <div className="card-body">
				  </div>

				  <div className="card-footer text-right">
				  	<img className="bottom-suit-mini suit-mini" alt="card-suit" src={this.props.cardSuitImg}/>
				  	<span className="suit-text-mini" style={{marginLeft: this.bottomMarginHacky(this.props.cardDenom, -30)}}>{this.normallizeDenom(this.props.cardDenom)}&nbsp;&nbsp;</span>
				  </div>
				</div>
			);
		} else if (this.props.isCardBack && this.props.isBasic) {
			cardRender = (
				<div className={this.props.klasses} onClick={this.props.clickHandler}>
				  <img className="img-fluid" src={this.props.cardImg} alt={this.props.cardImgAlt} />
				</div>
			);
		}

		return (
			<React.Fragment>
				{cardRender}
			</React.Fragment>
		);
	}
}

export default Card;