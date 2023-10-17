const express = require('express')

const router = express.Router()
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')

const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'views/images/uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
      cb(null, fileName);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
  
      if (!allowedFileTypes.includes(file.mimetype)) {
       return cb(new Error('fileError'));
      } 

      if (file.size > maxSize) 
      {
        return cb(new Error('sizeError'));

      }

      cb(null, true)
    },
  });

  
  



const mysql = require('../dbconfig')






router.get('/PhotoGallery', async (req, res) => 
{

    let page = parseInt(req.query.p) || 1
    const limit = 6
    const offset = (page - 1) * limit

    const uploadMessage = req.query.t || ""

    console.log(uploadMessage)

    const results = await new Promise ((resolve, reject)=>{

        mysql.query("SELECT * FROM upload_tbl where is_hidden = 0 ORDER BY id DESC limit ? offset ?  ",[+limit, +offset], (err, result) => {

            if(err) 
            {
                console.log(err)
                reject(err)
            }
            else{

                resolve(result)
            }
        })

    })

    const totalPageData = await new Promise ((resolve, reject)=>{

        mysql.query("SELECT count(*) as count FROM upload_tbl where is_hidden = 0", (err, result) => {
  
            if(err) 
            {
                console.log(err)
                reject(err)
            }
            else{
  
                resolve(result)
            }
        })
  
    })

    const totalPage = Math.ceil(+totalPageData[0]?.count / limit )

   let  next_link  = 'javascript::void(0)'
   let  prev_link  = 'javascript::void(0)'

    if (totalPage > 0)
    {

        

        let nextValue =  0 

        let preValue = 0

        if ( page < totalPage)
        {
            nextValue = page + 1  
        }
        if (page > 1) 
        {
            preValue = page -1

        }

        if (nextValue != 0) 
        {
            next_link = `PhotoGallery?p=${+nextValue}`
            
        }

        if(preValue != 0)  
        {
            prev_link = `PhotoGallery?p=${+preValue}`

        }
        
        
    }
    else 
    {
        page = 0
    }
   
   
    

    if (results) 
    {

       

        

  

        res.render('index', {title : "TEMPLATING WITH EJS page ", uploads : results, totalPage, page, next_link, prev_link, uploadMessage})
    }
   
   
    
})



router.post('/upload',  upload.single('imageToUpload'), async (req, res) => {

     const file = req.file;
     const filePath = file.path;
    const fileExtension = path.extname(file.originalname);
    const caption = req.body.caption

    const newPath = filePath.replace(/views/g, '');

   // console.log(newPath)

   //getCur date

        
        
   const currentDate = new Date();
   const year = currentDate.getFullYear();
   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
   const day = String(currentDate.getDate()).padStart(2, '0');
   const formattedDate = `${year}-${month}-${day}`;
   
   

        


    const query = "INSERT INTO upload_tbl (upload_path, caption, date) VALUES(?, ?, ?)"

    const result = await new Promise((resolve, reject) => {
        mysql.query(query, [newPath, caption, formattedDate], (err, result) => {
            if (err) 
            {
                console.log(err)
                reject(err)
                
            }
            else
            {
                resolve(result)
            }
        })
    })

    
    if (result) 
    {
        res.redirect('/PhotoGallery?t=uploaded')
        
    }
    else 
    {

        res.redirect('/PhotoGallery?t=uploadfailed')

    }

    //res.send("SUCCESSS")

  })

  router.post('/getDetails' , async(req, res) => {

    const id = req.body.id

    if (id) 
    {

        const result = await new Promise((resolve, reject) => {
            mysql.query("SELECT * FROM upload_tbl WHERE is_hidden = 0 AND id = ? ", [id], (err, result) => {

                if (err) 
                {
                    console.log(err)
                    reject(err)
                    
                }
                else 
                {
                    resolve(result)
                }
            })
        })


        if(result) 
        {
            res.json ({
                data : result
            })
        }
       
        
    }
    else 
    {
        res.json({
            data : false
        })
    }



  })

  router.post('/updateUpload', async(req, res) => {

    const {newCaption, uploadId, page } = req.body

    

    const is_existing = await new Promise((resolve, reject) => {
        mysql.query("SELECT * FROM upload_tbl WHERE is_hidden = 0 AND id = ?", [uploadId] , (err, result) => {

            if (err) 
            {
                console.log(err)
                reject(err)
            }
            else 
            {
                resolve(result)
            }
        })
    })

    if (is_existing.length > 0) 
    {
        const result = await new Promise((resolve, reject) => {
            mysql.query("UPDATE upload_tbl SET caption =? WHERE id = ? and is_hidden=0" , [newCaption, uploadId], (err, result) => {

                if (err) {
                    
                    console.log(err)
                    reject(err)
                }
                else if (page ==1) 
                {
                 res.redirect(`/PhotoGallery?t=updatesuccess`)
                }
                else 
                {
                    resolve(result)
                }

            })
        })

        if (result) 
        {
           // res.send('test success');
           if (page != 0) 
           {
              res.redirect(`/PhotoGallery?p=${page}&t=updatesuccess`)

            
           }
           else if (page ==1) 
           {
            res.redirect(`/PhotoGallery?t=updatesuccess`)
           }
           else
           {

            res.redirect(`/PhotoGallery?t=updatesuccess`)

            

           }
        
            
        }
        else {

            if(page != 0) 
            {
                res.redirect(`/PhotoGallery?p=${page}&t=updatefailed`)

            }
            else if (page ==1) 
            {
             res.redirect(`/PhotoGallery?t=updatefailed`)
            }
            else 
            {
                
                res.redirect(`/PhotoGallery?t=updatefailed`)

            }

           


        }
    }
    else 
    {

        if(page != 0) 
            {
                
                res.redirect(`/PhotoGallery?p=${page}&t=updatefailed`)

            }
            else 
            {
                
                res.redirect(`/PhotoGallery?t=updatefailed`)

            }

           



      

    }




  })


  router.post('/deleteUpload' , async(req, res) => {

    const id = req.body.id

    if (id) 
    {
        const is_existing = await new Promise((resolve, reject) => {
            mysql.query("SELECT * FROM upload_tbl WHERE is_hidden = 0 AND id = ?", [id] , (err, result) => {
    
                if (err) 
                {
                    console.log(err)
                    reject(err)
                }
                else 
                {
                    resolve(result)
                }
            })
        })

        if (is_existing) 
        {
            if (is_existing.length > 0) 
            {
                await new Promise((resolve, reject) => {
                    mysql.query("UPDATE upload_tbl SET is_hidden=1 WHERE is_hidden=0 AND id=?", [id], (err, result) =>{

                        if (err) 
                        {
                            console.log(err)
                            reject(err)

                            res.redirect('/PhotoGallery?t=deletefailed')
                            
                        }
                        else 
                        {
                            resolve(result)
                            res.redirect('/PhotoGallery?t=deletesuccess')
                        }
                    })
                })
            }
            else {

                res.redirect('/PhotoGallery?t=deletefailed')

            }

            
        }
        else {
            res.redirect('/PhotoGallery?t=deletefailed')

        }
        
    }
    else 
    {
        res.redirect('/PhotoGallery?t=deletefailed')
    }
  })



  router.use(function (err, req, res, next) {
    // Handle the error and redirect to another page
    res.redirect('/PhotoGallery?t=' + encodeURIComponent(err.message));
  });
  




module.exports = router