interface MasterCpReport_I {
    asal:string;
    bensin:number;
    catatan:string;
    created_at:number;
    created_date:string;
    created_by:string;
    crew:Array<CrewReport_I>;
    data_dn:Array<DNreport_I>;
    draggable:Array<DraggableReport_I>;
    helper:string;
    idstore:string;
    inputasal:string;
    invoice:boolean;
    kir_exp:string;
    km_berangkat:string;
    kodecp:string;
    marker:Array<any>;
    merk:string;
    nikPengemudi:string;
    nikhelper:string;
    no_polisi:string;
    pengemudi:string;
    polyline:Array<any>;
    ritase:number;
    rute:Array<RuteReport_I>;
    status:boolean;
    status_awal:boolean;
    status_data:string;
    stnk_exp:string;
    tanggal_berangkat:string;
    total_estimasi:TotalEstimasiReport_I;
    status_estimasi:boolean;
    total_jarak:number;
    type:string;
    tglbuat:string;
    statistik:string;
    nomor_telfon_crew:string;
    createdFrom:string
    avoidtolls:boolean
    total_value:number
}

interface DNreport_I {
    alamatDetail:string;
    alamatTujuan:string;
    created_at:number;
    created_date:string;
    ecom:boolean;
    foto:Array<any>;
    index:number;
    kirimDate:number;
    kirimKe:string;
    km_gmap:string;
    km_no:number;
    location:{lat:number, lng:number};
    namaDriver:string;
    noDN:string;
    noNP:string;
    noMobil:string;
    noResi:string;
    noTelfon:string;
    status:boolean;
    status_data:string;
    type:string;
    rating:number
    comment:string
    id_cpt:string;
    idstore:string;
    postingDate:string;
    postingTime:string;
    gabungan:boolean;
    np_gabungan:Array<string>;
    telfon_driver:string;
    telfon_helper:string
    tanggal_berangkat:string,
    lm : string,
    product_items:Array<{
        qty : number,
        item_no : any,
        total_value:number
    }>
    status_parsial : boolean
    no_invoice:string
    no_customer:string
}

interface CrewReport_I {
    id:string;
    nama:string;
    posisi:string;
    sim:string;
    telfon:string
}

interface RuteReport_I { 
    alamatTujuan:string;
    dest:{
        lat:number,
        lng:number
    };
    distance:number;
    distance_text:string;
    duration:number;
    duration_text:string;
    ecom:boolean;
    end_address:string;
    index:number;
    kirimKe:string;
    noDN:string;
    noTelfon:string;
    status:boolean;
    start_address:string;
    noNP:string;
    gabungan:boolean;
    parsial:boolean,
    lm:any;
    product_items:Array<{
        qty : number,
        item_no : any,
        total_value: number
    }>
    np_gabungan:Array<string>;
}

interface DraggableReport_I {
    latlg:Array<any>;
    nama:string;
    options:boolean;
    value:object
}

interface TotalEstimasiReport_I {
    helper :number;
    km25:number;
    kml25:number;
    tarif:number;
    trip_awal:number;
}
