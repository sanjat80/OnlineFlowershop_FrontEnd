import { Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Proizvod } from "../../app/models/proizvod";
import ProductForm from "./ProductForm";


export default function Inventory() {
    const [products, setProducts] = useState<Proizvod[]>([]);
    const[loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Proizvod | undefined>(undefined);
    const [vrste, setVrste] = useState<number[]>([]);
    const [kategorije, setKategorije] = useState<number[]>([]);
    const [pakovanja, setPakovanja]=useState<number[]>([]);
    const [target, setTarget] = useState(0);
    function handleSelectProduct(product: Proizvod){
        setSelectedProduct(product);
        setEditMode(true);
    }
    function handleDeleteProduct(id:number){
        setLoading(true);
        setTarget(id);
        agent.Admin.deleteProduct(id)
        .then(()=>{
            setProducts(prevProducts => prevProducts.filter(product => product.proizvodId !== id));
        })
        .catch(error=>console.log(error))
        .finally(() => {
            setLoading(false);
          });
    }

    function cancelEdit(){
        if(selectedProduct) setSelectedProduct(undefined);
        setEditMode(false);
    }

    useEffect(()=> {
       agent.Catalog.list().then(products => setProducts(products))
       .catch(error => console.log(error))
       .finally(()=>setLoading(false));
       agent.Type.getAllVrsta()
       .then((typesData)=>{
        setVrste(typesData);
       })
       agent.Package.getAllPakovanja()
       .then((packageData)=>{
        setPakovanja(packageData);
       })
       agent.Categories.getAllKategorije()
       .then((categoriesData)=>{
        setKategorije(categoriesData);
       })
    }, [])

    if(editMode) return <ProductForm product={selectedProduct} cancelEdit={cancelEdit} vrste={vrste} pakovanja={pakovanja} kategorije={kategorije}/>

    if(loading) return <LoadingComponent message="Učitavanje proizvoda..."/>
    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Inventar</Typography>
                <Button onClick={()=> setEditMode(true)} sx={{ m: 2 }} size='large' variant='contained'>Dodaj</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ProizvodId</TableCell>
                            <TableCell align="left">Proizvod</TableCell>
                            <TableCell align="right">Valuta</TableCell>
                            <TableCell align="center">Vrsta</TableCell>
                            <TableCell align="center">Zalihe</TableCell>
                            <TableCell align="center">Cijena</TableCell>
                            <TableCell align="center">Velicina</TableCell>
                            <TableCell align="center">Pakovanje</TableCell>
                            <TableCell align="right">Kategorija</TableCell>
                            <TableCell align="right">Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.proizvodId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {product.proizvodId}
                                </TableCell>
                                <TableCell align="left">
                                    <Box display='flex' alignItems='center'>
                                        <span>{product.naziv}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{product.valuta}</TableCell>
                                <TableCell align="center">{product.vrstaId}</TableCell>
                                <TableCell align="center">{product.zalihe}</TableCell>
                                <TableCell align="center">{product.cijena}</TableCell>
                                <TableCell align="center">{product.velicina}</TableCell>
                                <TableCell align="center">{product.pakovanjeId}</TableCell>
                                <TableCell align="center">{product.kategorijaId}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={()=>handleSelectProduct(product)} startIcon={<Edit />} />
                                    <Button startIcon={<Delete />} color='error' onClick={()=>handleDeleteProduct(product.proizvodId)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}