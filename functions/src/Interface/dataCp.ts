interface MasterCp_I {
    idstoreasal:string;
    avoidtolls:boolean;
    asal:string;
    bensin:number;
    catatan:string;
    created_at:number;
    created_date:string;
    created_by:string;
    crew:Array<Crew_I>;
    data_dn:Array<DN_I>;
    draggable:Array<Draggable_I>;
    helper:string;
    idstore:string;
    inputasal:string;
    invoice:boolean;
    kir_exp:string;
    km_berangkat:string;
    kodecp:string;
    marker:Array<any>;
    merk:string;
    idAllDn:string,
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
    total_estimasi:TotalEstimasi_I;
    status_estimasi:boolean;
    total_jarak:number;
    type:string;
    tglbuat:string;
    statistik:string;
    nomor_telfon_crew:string;
    createdFrom:string
    approve : boolean,
    approveBy : any,
    approveByName : any,
    approveAt : any,
    reject : boolean,
    rejectBy : any,
    rejectByName : any,
    rejectAt : any,
    total_value:number,
    totaljarak_ecom:number,
    totaljarak_nonecom:number,
    total_nonecomerce :{
        helper : number,
        km25 : number,
        kml25 : number,
        tarif:number,
        trip_awal:number
    },
    total_ecommerce :{
        helper : number,
        km25 : number,
        kml25 : number,
        tarif:number,
        trip_awal:number
    },
}

interface DN_I {
    // lmfix:string;
    idstoreasal:string;
    alamatDetail:string;
    alamatTujuan:string;
    created_at:number;
    created_date:string;
    ecom:boolean;
    foto:Array<any>;
    index:number;
    kirimDate:any;
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
    asalupload:boolean
    total_value : number
}


interface DNbarangBalik_I {
    alamatDetail:string;
    alamatTujuan:string;
    created_at:number;
    created_date:string;
    ecom:boolean;
    foto:Array<any>;
    index:number;
    created_by:string
    kirimDate:any;
    kodecp:string
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
    idstore:string;
    postingDate:string;
    postingTime:string;
    keterangan_balik:string
    fromdriver:boolean
}

interface Crew_I {
    id:string;
    nama:string;
    posisi:string;
    sim:string;
    telfon:string
}

interface Rute_I { 
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

interface Draggable_I {
    latlg:Array<any>;
    nama:string;
    options:boolean;
    value:object
}

interface TotalEstimasi_I {
    helper :number;
    km25:number;
    kml25:number;
    tarif:number;
    trip_awal:number;
}

interface CpCode_I {
    id:string
    kodestore:string
}
