import {table, findRecordByFilter, getMinifiedRecords} from "../../lib/airtable"

const favoriteCoffeStoreById = async(req, res) => {
    if(req.method === "PUT"){
        try {
            const { id } = req.body;

            if (id) {
                const records = await findRecordByFilter(id);

                if (records.length !== 0) {
                    // res.json(records);
                const record = records[0]

                const calcVoting = parseInt(record.voting) + 1
                
                
                
                const updateRecord = await table.update([
                    {
                        
                        id: record.recordId,
                        fields: {
                            voting: calcVoting,
                        }
                        
                    }
                ])
                
                if (updateRecord){
                   
                    const minifiedRecords = getMinifiedRecords(updateRecord)
                    res.json(minifiedRecords)
                }
                } else {
                res.json({ message: "Coffee store id doesn't exist", id });
                }
            } else {
                res.status(400);
                res.json({ message: "Id is missing" });
      }
        }catch(e){
            res.status(500)
            res.json({message: "Error cant upvote", e})
        }
    }
}

export default favoriteCoffeStoreById