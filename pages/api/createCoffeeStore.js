import {table, getMinifiedRecords, findRecordByFilter} from "../../lib/airtable"

const createCoffeeStore = async (req,res) => {
    
    if (req.method === "POST"){
        const {id, name, address, street, imgUrl, voting} = req.body
        
        try{
            if(id){
                const records = await findRecordByFilter(id)
                if(records.length !== 0){
                    res.json(records)
                } else {
                    if(name){
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    street,
                                    voting,
                                    imgUrl
                                }
                            }
                        ])
                        const records = getMinifiedRecords(createRecords)
                        res.json(records)
                    } else {
                        res.status(400)
                        res.json({message: "id or name missing"})
                }
            
                
            } 
            }else {
                res.status(400)
                res.json({message: " id is missing"})
            }
        
        }catch(e){
            console.error("error", e)
            res.status(500)
            res.json({message: "error", e})
        }
    }
}

export default createCoffeeStore