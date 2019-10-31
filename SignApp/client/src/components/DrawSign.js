import React, { Component } from "react";
import { saveAs } from 'file-saver'
import axios from 'axios';
import {Link} from 'react-router-dom';
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Line, Text } from "react-konva";
import PropTypes from 'prop-types';
import { MDBContainer, MDBRow, MDBBtn,MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText} from 'mdbreact';
import {connect} from 'react-redux';
import {fetchPosts} from '../actions/propsActions';
import EndDoc from './EndDoc';

class DrawSign extends Component {
  constructor(props){
    super(props)
    this.state = {
      lines: [],
      innerW: window.innerWidth - 100,
      props: {
        name: '',
        surname: '',
        email: '',
        random: 0,
        download: false,
        base64:''
      },
      buttonPosition: {
      buttonTable: true,
      buttonIMG: false,
      buttonUnderIMG: false
      }
    };
  }
  
  componentWillMount(){
    this.props.fetchPosts();
    window.addEventListener('resize', this.windowWidth);
    
  }
 
  handleMouseDown = () => {
    this._drawing = true;
    // add line
    this.setState({
      lines: [...this.state.lines, []]
    });
  };

  handleMouseMove = e => {
    // no drawing - skipping
    if (!this._drawing) {
      return;
    }
    const stage = this.stageRef.getStage();
    const point = stage.getPointerPosition();
    const { lines } = this.state;

    let lastLine = lines[lines.length - 1];
    // add point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    this.setState({
      lines: lines.concat()
    });
  };

  handleMouseUp = () => {
    this._drawing = false;
  };

  deleteSign = () => {
    this.setState({
      lines: []
    })
  }
 
 
  windowWidth = () => {
     const innerW = window.innerWidth;
     this.setState({
       innerW: innerW
     })
    }
   
    setBase = () => {
      let {name, surname, email, random, download} = this.props.createPost
     
      let dataURL = this.stageRef.toDataURL();
      this.setState({
      props: {
        name: name,
        surname: surname,
        email: email,
        random: random,
        download: download,
        base64: dataURL
      }
    })
  }
  downloadPDF = () => {
    this.setBase()
    this.setState({
      props:{
        name: this.state.props.name,
        surname: this.state.props.surname,
        email: this.state.props.email,
        random: this.state.props.random,
        download: this.state.props.download,
        base64: this.state.props.base64
      }
    })
    if(this.state.props.download === !false){
      axios.post('/create-img', this.state.props)
      .then(() => axios.post('/create-pdf', this.state))
      .then(() => axios.get('fetch-pdf', { responseType: 'blob' }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(pdfBlob, 'dokument.pdf');
      })
    } else {
      console.log('state console')
    }
  }
 
  componentDidMount() {
    this.setBase();
    
  }
  buttonTbl = () => {
    // let {buttonTable, buttonIMG, buttonUnderIMG} = this.state.buttonPosition;
    // if(buttonIMG === false && buttonUnderIMG === false){

      this.setState({
        buttonPosition: {
        buttonTable: !this.state.buttonPosition.buttonTable,
        buttonIMG: false,
        buttonUnderIMG: false,
        }
      })
    // }
  }
  buttonImg = () => {
    this.setState({
      buttonPosition: {
      buttonTable: false,
      buttonIMG: !this.state.buttonPosition.buttonIMG,
      buttonUnderIMG: false
      }
    })
  }
 buttonUnderImg = () => {
  this.setState({
    buttonPosition: {
    buttonTable: false,
    buttonIMG:  false,
    buttonUnderIMG: !this.state.buttonPosition.buttonUnderIMG
    }
  })
 }

  render() {
  
    return (
      <div>
      <MDBContainer>
      <MDBRow className="d-flex justify-content-center">
      <Stage
        style={{touchAction: 'none'}}
        onClick={this.setBase}
        onTap={this.setBase}
        className="block-example border border-primary mt-3 mb-3"
        width={this.state.innerW - 100}
        height={400}
        onContentMousedown={this.handleMouseDown}
        onContentMousemove={this.handleMouseMove}
        onContentMouseup={this.handleMouseUp}
        onContentTouchstart={this.handleMouseDown}
        onContentTouchmove={this.handleMouseMove}
        onContentTouchend={this.handleMouseUp}
        ref={node => {
          this.stageRef = node;
        }}
      >
    
        <Layer>
     
          {this.state.lines.map((line, i) => (
            <Line key={i} points={line} stroke="black" onClick={this.setBase} onTap={this.setBase}/>
          ))}
        </Layer>
      </Stage>
            
          <MDBBtn
          type="button"
          gradient="purple"
          rounded
          className="btn-block z-depth-1a w-20"
          onClick={this.deleteSign}
      >
          Ponownie podpisanie
      </MDBBtn>
      <h2>Place where sign will be</h2>
      <MDBCard style={{ width: '98.5%' }}>
      <MDBCardBody>
      <div className="d-flex justify-content-center justify-content-lg-center flex-column">
      <MDBBtn 
      outline color={this.state.buttonPosition.buttonTable ? 'success' : 'primary'} 
      onClick={this.buttonTbl}>
      Table sign</MDBBtn>
      <MDBBtn 
      outline color={this.state.buttonPosition.buttonIMG ? 'success' : 'primary'} 
      onClick={this.buttonImg}>
      Img sign</MDBBtn>
      <MDBBtn 
      outline color={this.state.buttonPosition.buttonUnderIMG ? 'success' : 'primary'} 
      onClick={this.buttonUnderImg}>
      Under img sign</MDBBtn>
      </div>
      </MDBCardBody>
    </MDBCard>
      <MDBBtn
      type="button"
      gradient="blue"
      rounded
      className="btn-block z-depth-1a w-20"
      onClick={this.downloadPDF}
      >
        Podpisz dokument
    </MDBBtn>
      
      </MDBRow>
      </MDBContainer>
        
      </div>
    );
  }
}

DrawSign.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  createPost: PropTypes.object
};

const mapStateToProps = state => ({
  posts: state.posts.items,
  createPost: state.posts.item
});


export default connect(mapStateToProps, {fetchPosts})(DrawSign);