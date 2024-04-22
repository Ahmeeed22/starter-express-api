const isAuth = require('../../../common/middleare/isAuth');
const { createNote, getClientNotes } = require('../controller/notes.controller');

const notesRoutes=require('express').Router() ;

notesRoutes.get("/GetAllClientNotes",isAuth('ALL'),getClientNotes) ;
notesRoutes.post("/AddNote",isAuth('ALL'),createNote) ;
// notesRoutes.get("/getCapitalAndOwnerDrawing",isAuth('ALL'),getCapitalAndOwnerDrawing)

module.exports=notesRoutes ;  