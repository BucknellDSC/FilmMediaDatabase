/**
 * This file is used to generate a gallery of screenshots before and after the
 * screenshot a user clicks on.
 *
 * Author: Team EndFrame
 * Organization: Bucknell University
 * Spring 2017
 */


import renderHTML from 'react-render-html';
import React, { Component } from 'react';
import Slider from 'react-slick';
import SvgIcon from 'material-ui/SvgIcon';
import IconButton from 'material-ui/IconButton';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import FullscreenDialog from 'material-ui-fullscreen-dialog';
import {GridTile} from 'material-ui/GridList';
import SVGCircle from './SVGCircle.jsx';
import ReactTooltip from 'react-tooltip';
import RaisedButton from 'material-ui/RaisedButton';
import BoundingBox from './BoundingBox.jsx';
import {beautifyTimeStamp} from '../helpers';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import _ from 'lodash';
import { Snackbar } from 'material-ui';
import { hashHistory } from 'react-router';

let TIME_LINE_LENGTH = 1150;
const STROKE_WIDTH = 3;
const CIRCLE_RADIUS = 7;


const style = {
  margin: 12
};


/**
 * Uses the Material-UI dialog to display screenshots before and after the screenshot
 * a user selects. Uses a gallery component to display the screenshots and connects
 * to the Redux store to know when a user clicks on a screenshot or browses through
 * screenshots in the context.
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class ContextDialog extends Component {

  /**
   * Initializes the state and binds event handlers to the class.
   * @param {object} props The data propogated into the component
   */
  constructor(props) {
    super(props);

    // state is initialized to keeping the dialog closed
    this.state = {
      open: false,
      boxes: [],
      showBoundingBoxes: true,
      isBoxSelected: false,
      selectedBox: -1,
      snackbar: {
        msg: '',
        open: false
      }
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.contextDialogueColorSearch = this.contextDialogueColorSearch.bind(this);
    this.slideLeft = this.slideLeft.bind(this);
    this.slideRight = this.slideRight.bind(this);
    this.toggleBoundingBoxes = this.toggleBoundingBoxes.bind(this);
    this.selectBox = this.selectBox.bind(this);
    this.deselectBox = this.deselectBox.bind(this);
    this.reportBox = this.reportBox.bind(this);
    this.buildTimeline = this.buildTimeline.bind(this);
  }

  /**
   * Closes the dialog if the user presses the Escape key.
   *
   * @param {event} e React synthetic event
   * @returns {undefined}
   */
  handleKeyPress(e) {
    if (e.keyCode === 27) { // Handle excape key press
      this.handleClose();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    this.retrieveBoundingBoxes(this.props.currentFilm.movieOclcId, this.props.currentScreenshot.movieLineNumber);
    this.setState({open: true});
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleOpen() {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({open: false}, () => {
      const {
        searchType,
        searchTerm,
        confidence
      } = this.props;
      setTimeout(() => hashHistory.push(`${searchType}/${searchTerm}?confidence=${confidence}`), 500);

    });
    // TODO: Remove this. It's a terrible idea because it doesn't preserve history
    // window.history.back();
  }

  componentWillReceiveProps(nextProps) {
    // open the context dialog if screenshot is clicked or URL is updated
    if (this.state.open === false && nextProps.contextScreenshotMovieOclcId !== null) {
      this.handleOpen();
    }
    if (this.currentFilm && this.currentScreenshot) {
      this.retrieveBoundingBoxes(nextProps.currentFilm.movieOclcId, nextProps.currentScreenshot.movieLineNumber);
    }
  }

  /**
   * Toggles bounding boxes on the currently focused image
   * @param {object} event The event triggering the call
   * @param {boolean} checked The new state of the checkbox's toggle
   * @returns {undefined}
   */
  toggleBoundingBoxes(event, checked) {
    this.setState({showBoundingBoxes: checked });
  }


  /**
   * Slides the image gallery to the specified index
   * @param {number} index An integer that represents the screenshot to slide
   * to in the image gallery.
   * @returns {undefined}
   */
  svgSlideTo(index) {
    // TODO: - Left image will fail to load most of the time
    // Might be implemented better down the road?

    // this.retrieveBoundingBoxes(this.props.currentFilm.movieOclcId, index);
    this.deselectBox(() => this.slider.slickGoTo(index));
  }

  /**
   * Slides the image gallery one to the left if able
   * @returns {undefined}
   */
  slideLeft() {
    if (this.props.currentScreenshot !== null) {
      // this.retrieveBoundingBoxes(this.props.currentFilm.movieOclcId, this.props.currentScreenshot.movieLineNumber - 1);
      this.deselectBox(() => this.slider.slickGoTo(this.props.currentScreenshot.movieLineNumber - 2));
    }
  }

  /**
   * Slides the image gallery one to the right if able
   * @returns {undefined}
   */
  slideRight() {
    if (this.props.currentScreenshot !== null) {
      // this.retrieveBoundingBoxes(this.props.currentFilm.movieOclcId, this.props.currentScreenshot.movieLineNumber + 1);
      this.deselectBox(() => this.slider.slickGoTo(this.props.currentScreenshot.movieLineNumber));

    }
  }

  /**
   * Instantiates and maps each time line circle to a screenshot in the results page
   * for the current film and sets the x position of the circle based on the
   * timestamp of the mapped screenshot.
   * @returns {array} The click-able time line circles
   */
  getScreenShotTimes() {
    return this.props.currentFilm.results.map((result) =>
      <SVGCircle
        slideTo={() => {}}
        index={result.movieLineNumber - 1}
        key={`screenshot${result.movieLineNumber}`}
        x={Math.ceil((result.movieLineNumber - 1) / (this.props.currentFilm.totalNumberOfLines) * (TIME_LINE_LENGTH)) + CIRCLE_RADIUS + STROKE_WIDTH}
        y="50"
        radius={CIRCLE_RADIUS}
        stroke={'gray'}
        strokeWidth={1}
      />
    );
  }

  /**
   * Instantiates all ReactTooltip elements and maps them to both
   * the correct SVGCircle element and the corresponding screenshot.
   * @returns {array} All the image tooltips for the time line circles.
   */
  createImageTooltips() {
    return this.props.currentFilm.results.map((result) =>
      <ReactTooltip
        id={'SVGCircle' + (result.movieLineNumber - 1)}
        aria-haspopup='true'
        role='example'
        key={`tooltip${result.movieLineNumber}`}
      >
        <img height='100'
          src={`${process.env.IMG_SRC}${this.props.currentFilm.movieOclcId}/${result.movieLineNumber}.png`}
        />
      </ReactTooltip>
      );
  }

  /**
   * Makes a call to the color search API by updating the
   * URL. Performs the color search that is done on the
   * Context Page.
   * @returns {undefined}
   */
  contextDialogueColorSearch() {
    let newPath = `/${this.props.currentFilm.movieOclcId}/${this.props.currentScreenshot.movieLineNumber}`;
    hashHistory.push(newPath);
  }

  /**
   * Retrieve bounding boxes for the given line in a movie
   * @param {integer} oclcId The OCLC ID for the given movie
   * @param {integer} lineNo The Line number within the given movie
   * @returns {undefined}
   */
  retrieveBoundingBoxes(oclcId, lineNo) {
    // Request bounding boxes and unwrap
    const bBoxApiCall = `${window.location.origin}/api/boundingbox/${oclcId}/${lineNo}?confidence=${this.props.confidence}`;

    if (!_.has(this.state.boxes, `${oclcId}-${lineNo - 1}`)) {
      fetch(bBoxApiCall)
      .then((res) => res.json())
      .then((res) => {
        const boxes = {};
        boxes[`${oclcId}-${lineNo}`] = res.results;
        this.setState({
          ...this.state,
          boxes: { ...this.state.boxes, ...boxes }
        });
      });
    }
  }

  deselectBox(cb = () => {}) {
    this.setState({
      isBoxSelected: false,
      selectedBox: -1
    }, cb);
  }

  reportBox() {
    const reportApiCall = `${window.location.origin}/api/boundingbox/report/${this.state.selectedBox}`;
    fetch(reportApiCall, {
      method: 'PUT'
    })
    .then((res) => res.json())
    .then((res) => {
      this.setState({
        snackbar: {
          msg: 'Object Reported, Thank you!',
          open: true
        }
      }, () => this.deselectBox(() => {
        setTimeout(() => {
          this.setState({
            snackbar: {
              msg: '',
              open: false
            }
          });
        }, 4000);
      }));
      return res;
    })
    .catch(error => error);
  }

  selectBox(id, hasFocus) {
    if (this.state.isBoxSelected && this.state.selectedBox === id) {
      this.deselectBox();
    } else if (hasFocus) {
      this.setState({
        isBoxSelected: true,
        selectedBox: id
      });
    }
  }

  buildTimeline() {

    try {
      TIME_LINE_LENGTH = this.ctxTimeline.offsetWidth * 0.8;
    } catch (err) {
      console.log();
    }

    let lineNo = -1;
    let totalLines = -1;
    try {
      lineNo = this.props.currentScreenshot.movieLineNumber;
      totalLines = this.props.currentFilm.totalNumberOfLines;
    } catch (err) {
      console.log();
      return null;
    }

    const tick = Math.ceil((lineNo - 1) / totalLines * TIME_LINE_LENGTH) + CIRCLE_RADIUS + STROKE_WIDTH;

    return (
      <div>
        <svg height="70" width={TIME_LINE_LENGTH + 2 * (CIRCLE_RADIUS + 5)}>
          <line x1={CIRCLE_RADIUS} y1="50" x2={10 + TIME_LINE_LENGTH} y2="50" stroke={'grey'} strokeWidth={1} />
          {this.getScreenShotTimes()}
          {
            this.props.currentScreenshot !== null ? (
              <line
                x1={tick}
                x2={tick}
                y1="35"
                y2="65"
                strokeWidth={2}
                stroke={'black'}
              />
            ) : null
          }
        </svg>
          {this.createImageTooltips()}
      </div>
    );
  }

  /**
   * Render the context page.
   * @returns {object} The JSX object representing this class
   */
  render() {

    return (
      <FullscreenDialog
        title={`${this.props.currentFilm && this.props.currentFilm.results.length} Results in "${this.props.currentFilm && this.props.currentFilm.movieTitle}"`}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        <div className="contextImageGallery">
          <Slider
              dots={false}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              infinite={false}
              initialSlide={this.props.currentMovieLineNumber - 1}
              afterChange={(idx) => {
                this.retrieveBoundingBoxes(this.props.currentFilm.movieOclcId, idx);
                this.props.onSlideAndCheckForContext(idx);
              }}
              nextArrow={null}
              prevArrow={null}
              lazyLoad={true}
              centerMode={true}
              preLoad={6}
              focusOnSelect={true}
              ref={
                (slider) => {
                  this.slider = slider;
                }
              }
          >
            { this.props.images.map((imageNumber) =>
              <GridTile className="contextImage"
                titleBackground={'rgba(0, 0, 0, 0.3)'}
                key={`img${imageNumber}`}
              >
                <BoundingBox
                  src={`${process.env.IMG_SRC}${this.props.currentFilm.movieOclcId}/${imageNumber}.png`}
                  boxes={this.state.boxes[`${this.props.currentFilm.movieOclcId}-${imageNumber}`] || []}
                  selectedBox={this.state.selectedBox}
                  onSelectBox={this.selectBox}
                  confidence={this.props.confidence}
                  display={this.state.showBoundingBoxes && imageNumber === this.props.currentMovieLineNumber}
                />
              </GridTile>
            )}
          </Slider>
        </div>
        <div className="contextDialogue">
          <div>
            <Checkbox
              checkedIcon={<Visibility />}
              uncheckedIcon={<VisibilityOff />}
              label="Bounding Boxes"
              style={{
                display: 'inline-block',
                width: '200px',
                fontSize: '16px'
              }}
              checked={this.state.showBoundingBoxes}
              onCheck={this.toggleBoundingBoxes}
            />
          </div>
          <IconButton onClick={this.slideLeft}>
            <SvgIcon>
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
            </SvgIcon>
          </IconButton>
          <IconButton onClick={this.slideRight}>
            <SvgIcon>
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
            </SvgIcon>
          </IconButton>
          {
            this.props.currentScreenshot !== null ? (
              <div>
                {renderHTML(this.props.currentScreenshot.movieLineText)} <br />
                {beautifyTimeStamp(this.props.currentScreenshot.movieStartTimeStamp)}<br/>
              </div>
            ) : (
              <div>
                Loading Context...
              </div>
            )
          }
        </div>
        <div className="ContextTimeLine" ref={ (cmp) => {
          this.ctxTimeline = cmp;
        } }>
          {this.props.currentFilm !== null ? this.buildTimeline() : null}
        </div>
        <div className="colorSearchButton" >
            <RaisedButton onClick={this.contextDialogueColorSearch} label="Color Search" style={style} />
            <RaisedButton disabled={!this.state.isBoxSelected} onClick={this.reportBox} label="Report Selected Object?" style={style} />
        </div>
        <Snackbar autoHideDuration={3000} message={this.state.snackbar.msg} open={this.state.snackbar.open}/>
      </FullscreenDialog>
    );
  }
}


/**
 * Redux event that handles changing the current screenshot in the gallery.
 * @param {number} newMovieLineNumber The movie line number to change to
 * @returns {object} The action for sliding the current screenshot
 */
const slideScreenshot = (newMovieLineNumber) => {
  return {
    type: 'SLIDE_SCREENSHOT',
    newMovieLineNumber
  };
};


/**
 * Redux event that receiving context from an API call.
 * @param {object} context The context received from the API call
 * @returns {object} The action for receiving a new
 */
const receiveContext = (context) => {
  return {
    type: 'RECEIVE_CONTEXT',
    movieOclcId: context.movieOclcId,
    context: context.results
  };
};


/**
 * Handler function that is called by the image gallery when the current movie line number is changed.
 * Updates the Redux store with the new line number and makes an API call for the new line number
 * if it does not already exist in the database.
 * @param {number} newMovieLineNumberIndex The new movie line number
 * @returns {function} A function for querying a new context and updating the redux store
 */
const slideAndCheckForContext = (newMovieLineNumberIndex) => {
  return (dispatch, getState) => {
    let state = getState();

    let currentFilm = !state.contextMovieOclcId ? null :
      _.find(state.search.response, film => state.contextMovieOclcId === film.movieOclcId);

    let context = state.context;

    let newMovieLineNumber = newMovieLineNumberIndex + 1;

    // check if context already exists
    let newMovieLineNumberNotInContext = context.find(screenshot =>
      screenshot.key === `oclc${currentFilm.movieOclcId}line${newMovieLineNumber}`) === undefined;

    dispatch(slideScreenshot(newMovieLineNumber));

        // make API call if screenshot does not exist
    if (newMovieLineNumberNotInContext) {
      fetch(`/api/moviesearch/context/${currentFilm.movieOclcId}/${newMovieLineNumber}`)
        .then(response => response.json())
        .then(response => response.context)
        .then(response => dispatch(receiveContext(response)));
    }
  };
};

const getContext = (state) => state.context;

const getClickedScreenshotMovieOclcId = (state) => state.contextMovieOclcId;

const getCurrentContextMovieLineNumber = (state) => state.currentContextMovieLineNumber;

const getSearchResponse = (state) => state.search && state.search.response;

const getCurrentFilm = createSelector(
  [getClickedScreenshotMovieOclcId, getSearchResponse],
  (clickedScreenshotMovieOclcId, searchResponse) => {
    return !clickedScreenshotMovieOclcId ? null :
      searchResponse.find(film => clickedScreenshotMovieOclcId === film.movieOclcId);
  }
);

const getCurrentScreenshot = createSelector(
  [ getClickedScreenshotMovieOclcId, getCurrentContextMovieLineNumber, getContext ],
  (imgMovieOclcId, imgMovieLineNo, context) => {
    return _.find(context, img => (img.key === `oclc${imgMovieOclcId}line${imgMovieLineNo}`)) || null;
  }
);

const getImages = createSelector(
  [ getClickedScreenshotMovieOclcId, getCurrentFilm ],
  (clickedScreenshotMovieOclcId, currentFilm) => {
    let totalNumberOfLines = currentFilm === null ? 0 : currentFilm.totalNumberOfLines;
    return [...Array(totalNumberOfLines).keys()].map(screenshotNumber => screenshotNumber + 1);
  }
);

// Map Redux state to component props
function mapStateToProps(state) {
  return {
    contextScreenshotMovieOclcId: getClickedScreenshotMovieOclcId(state),
    currentMovieLineNumber: getCurrentContextMovieLineNumber(state),
    currentFilm: getCurrentFilm(state),
    currentScreenshot: getCurrentScreenshot(state),
    images: getImages(state),
    searchType: state.search && state.search.searchType ? state.search.searchType : null,
    searchTerm: state.search && state.search.searchTerm ? state.search.searchTerm : null,
    confidence: state.search && state.search.confidence ? state.search.confidence : null
  };
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onSlideAndCheckForContext: (newMovieLineNumberIndex) => dispatch(slideAndCheckForContext(newMovieLineNumberIndex))
  };
}
