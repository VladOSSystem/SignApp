const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const HummusRecipe = require('hummus-recipe');
const pdfTemplate = require('./documents');
const app = express();
const expressip = require('express-ip');
var base64Img = require('base64-img');
const port = process.env.PORT || 5000;
app.use(expressip().getIpInfoMiddleware);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/create-img', (req,res) => {
    
     base64Img.img(`${req.body.base64}`, './PDF', '1', function(err, filepath) {});

    res.send('OK')
  

})
app.post('/create-pdf', (req, res) => {
    console.log(req.body.buttonPosition)
    let widts = 0;
    let width = req.body.innerW;
    switch(true){
        case (width >= 1 && width < 300):
            widths = 50;
            break;
        case (width >= 300 && width < 500):
            widths = 80;
            break;
        case (width >= 500 && width < 750):
            widths = 120;
            break;
        case (width >= 750 && width < 1000):
            widths = 150;
            break;
        case (width >= 1000 && width < 1250):
            widths = 180;
            break;
        case (width >= 1000 && width < 2144):
                widths = 250;
                break;
        default:
            widths = 100
    }
    console.log(widths)
   
    if(req.body.buttonPosition.buttonTable == true){
    const pdfDoc = new HummusRecipe('./PDF/1.pdf', './PDF/out.pdf');
    pdfDoc
    .editPage(1) 
    .text(`${req.body.props.name}`, 250, 425)
    .text(`${req.body.props.surname}`, 250, 445)
    .text(`${req.body.props.email}`, 250, 465)
    .image('./PDF/1.png', 350, 600, {width: widths, keepAspectRatio: true})
    .endPage()  
   
    // end and save 
    .endPDF();
    } else if(req.body.buttonPosition.buttonIMG == true){
        const pdfDoc = new HummusRecipe('./PDF/1.pdf', './PDF/out.pdf');
        pdfDoc
        .editPage(1) 
        .text(`${req.body.props.name}`, 250, 425)
        .text(`${req.body.props.surname}`, 250, 445)
        .text(`${req.body.props.email}`, 250, 465)
        .image('./PDF/1.png', 150, 600, {width: widths, keepAspectRatio: true})
        .endPage()  
    
        // end and save 
        .endPDF();
    } else if(req.body.buttonPosition.buttonUnderIMG == true){
        const pdfDoc = new HummusRecipe('./PDF/1.pdf', './PDF/out.pdf');
        pdfDoc
        .editPage(1) 
        .text(`${req.body.props.name}`, 250, 425)
        .text(`${req.body.props.surname}`, 250, 445)
        .text(`${req.body.props.email}`, 250, 465)
        .image('./PDF/1.png', 150, 700, {width: widths, keepAspectRatio: true})
        .endPage()  
    
        // end and save 
        .endPDF();
    }
    

    // pdf.create(pdfTemplate(req.body, req.ipInfo), {}).toFile('./PDF/out.pdf', (err) => {
        
    //     if(err) {
    //         res.send(Promise.reject());
    //     }

    //     res.send(Promise.resolve());
    // });
    res.send('OK')
});


app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/PDF/out.pdf`)
})

app.listen(port, () => console.log(`Listening on port ${port}`));