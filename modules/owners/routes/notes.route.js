const isAuth = require('../../../common/middleare/isAuth');
const { createNote } = require('../controller/notes.controller');

const notesRoutes=require('express').Router() ;

// notesRoutes.post("/getAllOwners",isAuth('ALL'),getAllOwners) ;
notesRoutes.post("/AddNote",isAuth('ALL'),createNote) ;
// notesRoutes.get("/getCapitalAndOwnerDrawing",isAuth('ALL'),getCapitalAndOwnerDrawing)

module.exports=notesRoutes ;  