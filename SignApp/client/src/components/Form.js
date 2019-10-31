import React, { Component } from 'react';
import { saveAs } from 'file-saver'
import axios from 'axios';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { Link, Redirect, BrowserRouter as Router, Route } from 'react-router-dom';
import propTypes from 'prop-types'
import {connect} from 'react-redux';
import {createPost} from '../actions/propsActions'
import {  
     MDBContainer,
     MDBRow, MDBCol,
     MDBCard,
     MDBCardBody,
     MDBInput,
     MDBBtn,
     MDBFormInline,
     MDBModalFooter,
      } from 'mdbreact';
import '../App.css';

class Form extends Component {
  constructor(){
    super();
    this.state = {
         name: '',
         surname: '',
         email: '',
         random:  Math.floor(Math.random() * 1000000000),
         download: false
       }
  }

    downloadPDF = () => {
      this.setState({
        download: !this.state.download
      })
      // axios.post('/create-pdf', this.state)
      // .then(() => axios.get('fetch-pdf', { responseType: 'blob' }))
      // .then((res) => {
      //   const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      //   saveAs(pdfBlob, 'dokument.pdf');
      // })
    }
    nextSignup = (random) => {
      axios.get(`/dokument/${random}`)
        .then( (response) => {
          // handle success
          // console.log('hello')
          console.log(response);
        })
        .catch( (error) => {
          // handle error
          console.log(error);
        })
    }
  
    handleForm = (evt) => {
      this.props.createPost(this.state)
      this.setState({ [evt.target.name]: evt.target.value });
      
    }
    onSubmit = () => {
      const props = {
        name: this.state.name,
        surname: this.state.surname,
        email: this.state.email,
        random: this.state.random,
        download: this.state.download
      }
      this.props.createPost(props)
    }
    componentDidMount(){
      this.onSubmit()
    }


  render() {
    let random = this.state.random;
    let date = new Date();
    let day = date.getUTCDate(),
        mounth = date.getUTCMonth() + 1;
    console.log(this.state)
    return (
    <MDBContainer style={{marginTop: "50px"}}>
    <MDBRow className="d-flex alignt-items-center justify-content-center mt-4 mb-4">
      <MDBCol  sm="10" md="8" lg="6">
        <MDBCard >
          <MDBCardBody className="mx-4" md="4">
            <div className="text-center">
              <h3 className="dark-grey-text mb-1">
                <strong>Dokument<h6>Date/{day}/{mounth}/{random}</h6 ></strong>
              </h3>
            </div>
          
            <MDBInput
              label="Imię"
              name="name"
              group
              type="text"
              validate
              error="wrong"
              success="right"
              value={this.state.name}
              onChange={this.handleForm}
            />
            <MDBInput
              label="Nazwisko"
              name="surname"
              group
              type="text"
              validate
              error="wrong"
              success="right"
              value={this.state.surname}
              onChange={this.handleForm}
            />
            <MDBInput
              label="Wpisz swój email"
              name="email"
              group
              type="email"
              validate
              containerClass="mb-0"
              value={this.state.email}
              onChange={this.handleForm}
            />
            <div className="text-center mb-3">
            <MDBBtn
              type="button"
              outline color={this.state.download ? "success" : "warning"}
              rounded
              className="btn-block z-depth-1a mt-4"
              onClick={this.downloadPDF}
            >
            {this.state.download ? 'PDF będzie pobierzony' : 'Pobrać PDF'}
            </MDBBtn>
            </div>
          
            <div className="text-center mb-3">
            <Link to={{pathname:'/dokument'}} >
           
              <MDBBtn 
                type="button"
                gradient="blue"
                rounded
                onClick={this.onSubmit}
                className="btn-block z-depth-1a"
              >
              
                Podpisz dokument
              </MDBBtn>
              </Link>
              
            </div>
          </MDBCardBody>
          <MDBModalFooter className="mx-5 pt-3 mb-1">
          </MDBModalFooter>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
    )
  } 
}
Form.propTypes = {
  createPost: propTypes.func.isRequired
}
export default connect(null,{ createPost })(Form)
