export const generarTotal = (valorInicial = 200) => {
    let total = 0;
    let valor = valorInicial;

    const getTotal = () => total;

    const resetTotal = () => total = 0;

    const calcularTotal = (cantidad, descuento) => {
        const importe = valor * cantidad;
        return importe - (importe * descuento);
    }

    return {
        getTotal,
        resetTotal,
        calcularTotal
    }
};