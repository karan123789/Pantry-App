"use client"

import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material"
import { firestore } from "@/firebase"
import { collection, getDocs, query, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
  borderRadius: 4,
};

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [itemName, setItemName] = useState('')
  
  const updatePantry = async () => { 
    const snapshot = query(collection(firestore, 'pantry'));
    const pantryList = []
    const docs = await getDocs(snapshot);
    docs.forEach((doc) => { 
      pantryList.push({name: doc.id, ...doc.data()})
    }) 
    setPantry(pantryList)
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item.toLowerCase())
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      await setDoc(docRef, { count: count + 1 })
    } else {
      await setDoc(docRef, { count: 1 })
    }
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      if (count === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { count: count - 1 })
      }
    }
    await updatePantry()
  }

  const filteredPantry = pantry.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display={"flex"}
      justifyContent={"center"}
      flexDirection={'column'}
      alignItems={"center"}
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 3,
      }}
      gap={3}
    > 
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color={"black"}>
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button 
              variant="contained"
              onClick={() => {
                if (itemName.trim() !== "") {
                  addItem(itemName.trim())
                  setItemName('')
                  handleClose()
                }
              }}
              sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h2" color="#333" mb={2} fontWeight="bold">
        My Pantry
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField
          label="Search Items"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ bgcolor: 'white', borderRadius: 1 }}
        />
        <Button 
          variant="contained" 
          onClick={handleOpen} 
          sx={{ 
            bgcolor: '#1976d2', 
            '&:hover': { bgcolor: '#1565c0' },
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          Add Item
        </Button>
      </Stack>
      <Box 
        border={"none"} 
        borderRadius={4} 
        width="100%" 
        maxWidth="800px" 
        overflow="hidden"
        boxShadow="0 10px 30px rgba(0, 0, 0, 0.1)"
      >
        <Box 
          width="100%"
          bgcolor={"#3f51b5"} 
          display={"flex"} 
          justifyContent={"center"} 
          alignItems={"center"}
          py={3}
        >
          <Typography variant={"h4"} color={"white"} textAlign={"center"} fontWeight="bold">
            Pantry Items
          </Typography>
        </Box>
        <Stack 
          width="100%" 
          maxHeight="500px" 
          spacing={2} 
          overflow={'auto'} 
          padding={2}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {filteredPantry.map(({name, count}) => (
            <Box 
              key={name}
              width="100%"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={'white'}
              color={"#000000"}
              padding={2}
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              borderRadius={2}
              sx={{ 
                '&:hover': { 
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Typography variant={"h6"} color={"#333"} fontWeight="bold">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={"body1"} color={"#666"}>
                Quantity: {count}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => removeItem(name)} 
                sx={{ 
                  bgcolor: '#e53935', 
                  '&:hover': { bgcolor: '#d32f2f' },
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}