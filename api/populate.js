const mysql = require('../dbconfig')


module.exports = async (page, limit) => 
{   


    const offset = (page - 1) * limit

    const query = "SELECT * FROM task_tbl";

    

    const result1 = await new Promise ((resolve, reject)=>{

        mysql.query("SELECT * FROM task_tbl limit ? offset ? ",[+limit, +offset], (err, result) => {

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

        mysql.query("SELECT count(*) as count FROM task_tbl", (err, result) => {

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



    if (result) 
    {
        return result
        
    }
    else 
    {
        return false
    }


}