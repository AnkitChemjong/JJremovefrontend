import {type FormData } from "@/pages/Login";
import type { Vehicle } from "@/pages/AdminVehicle";
import type { FAQ } from "@/pages/AdminFAQ";
import type { ContactInfo } from "@/components/UpdateContactInfo";


export interface AdminErrorType{
    currentPassword?: string;
    newPassword?: string;
  username?:string;
  name?:string;
  email?: string;
  password?: string;
  roles?: string;
}

export const validateChangePassInput=(value:any):AdminErrorType=>{
    let error:AdminErrorType={};

    
    if (value?.currentPassword===""){
        error.currentPassword="Password should not be empty";

    }
    else if(value?.currentPassword?.toString().length<8){
        error.currentPassword="Minimun pass length is 8."
    }
    else{
        error.currentPassword="";
    }
    if (value?.newPassword===""){
        error.newPassword="New Password should not be empty";

    }
    else if(value?.newPassword?.toString().length<8){
        error.newPassword="Minimun pass length is 8."
    }
    else{
        error.newPassword="";
    }
    if (value?.password===""){
        error.password="Password should not be empty";

    }
    else if(value?.password?.toString().length<8){
        error.password="Minimun pass length is 8."
    }
    else{
        error.password="";
    }
    if(value?.username===""){
        error.username="UserName should not be empty";
    }
    if(value?.name===""){
        error.name="Name should not be empty";
    }
    if(value?.email===""){
        error.email="Email should not be empty";
    }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.email)){
        error.email="Invalid email format";
    }
    if(value?.roles?.length===0){
        error.roles="At least one role should be selected";
    }
    else{
        error.roles="";
    }
  return error;
}




export interface errorVehicle{
    name?: string;
    description?: string;
    basePrice?: string;
    capacityCubicMeters?: string;
    imageUrl?: string;
    extraNotes?: string;
}

export const validateCreateVehicleInput=(value:Vehicle):errorVehicle=>{
    let error:errorVehicle={};

    if (value.name===""){
        error.name="Name should not be empty";
    }
    else{
        error.name="";
    }
    if(value.description===""){
        error.description="Description should not be empty";
    }
    else{
        error.description="";
    }
    if(Number(value.basePrice)===0){
        error.basePrice="Base Price should not be 0";
    }
    else if(Number(value?.basePrice)<0){
        error.basePrice="Base Price should not be negative";
    }
    else{
        error.basePrice="";
    }
    if(Number(value?.capacityCubicMeters)<0){
        error.capacityCubicMeters="Capacity should not be negative";
    }
  else if(Number(value?.capacityCubicMeters)===0){
        error.capacityCubicMeters="Capacity should not be 0"; 
  }
  else{
        error.capacityCubicMeters="";
  }
  if(value.imageUrl===null){
        error.imageUrl="Image URL should not be empty";
    }
    else{
        error.imageUrl="";
    }
    if(value.extraNotes===""){
        error.extraNotes="Notes should not be empty";
    }
    else{
        error.extraNotes="";
    }
  return error;
}

export interface errorType{
    username?: string;
    password?: string;
    confirmPassword?: string;
}
export const validateLoginInput=(value:FormData):errorType=>{
    let error:errorType={};

    if (value.username===""){
        error.username="UserName should not be empty";
    }
    else{
        error.username="";
    }
    if (value.password===""){
        error.password="Password should not be empty";

    }
    else if(value.password?.toString().length<8){
        error.password="Minimun pass length is 8."
    }
    else{
        error.password="";
    }
  return error;
}

export interface FAQError{
    question?:string;
    answer?:string;
}
export const validateFaqInput=(value:FAQ):FAQError=>{
let error:FAQError={};
if(value.question===""){
    error.question="Qustion should not be empty."
}
else{
    error.question="";
}
if(value.answer===""){
    error.answer="Answer should not be empty."
}
else{
    error.answer="";
}

return error;
}

export interface errorContact{
  address?: string;
  email?: string;
  phone1?: string;
  phone2?: string;
  officeHours?: string;
  mapEmbedUrl?: string;
}
export const validateContactInput=(value:ContactInfo):errorContact=>{
    let error:errorContact={};
    if(value.address===""){
        error.address="Address should not be empty."
    }
    else{
        error.address="";
    }
    if(value.email===""){
        error.email="Email should not be empty."
    }
    else{
        error.email="";
    }
    if(value.phone1===""){
        error.phone1="Phone1 should not be empty."
    }
    else{
        error.phone1="";
    }
    if(value.phone2===""){
        error.phone2="Phone2 should not be empty."
    }
    else{
        error.phone2="";
    }
    if(value.officeHours===""){
        error.officeHours="OfficeHours should not be empty."
    }
    else{
        error.officeHours="";
    }
    if(value.mapEmbedUrl===""){
        error.mapEmbedUrl="MapEmbedUrl should not be empty."
    }
    else{
        error.mapEmbedUrl="";
    } 
    return error;
    }