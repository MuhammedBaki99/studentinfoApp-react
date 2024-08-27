import { useState } from 'react'
import './App.css'

function App() {
  const [studentList, setStudentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(0); 

  
  function handleForm(e) {  //formun gönderilmesini engeller
    e.preventDefault();

    let formData = new FormData(e.target); //e.target dediğimiz tıklanan formu yakalar onu formdata değişkenine atar
    let formObj = Object.fromEntries(formData.entries()); //formdan gelen verileri formobj değişkenine atar
    let generateId = () => {  //generateId isimli bir fonksiyon oluşturur
      setId(id + 1);  //her seferinde id değişkenini 1 artmasını sağlar.
      return id;  //id değerini dönmesini sağlar
    }

    if (!(formObj.id)) {  //eğer formobj içinde id yoksa
      formObj.id = generateId();  //id yi oluştur ve generateId fonksiyonunu ata
    }

    e.target.reset(); //tıklanan formu resetle yani inputa girilen verileri temizle
    setStudentList([...studentList, formObj]);  //studentListin içinde ki verileri koruyup yenisini yanına eklenmesini sağlar.

  } 

  function updateRecord(record) {
    let foundRecord = studentList.find(x => x.id === record.id);
    Object.assign(foundRecord, record);
    setStudentList([...studentList]);
  }

  function deleteRecord(id) {
    if (confirm('Emin misiniz?')) {
      setStudentList(studentList.filter(x => x.id !== id));
    }
  }
  console.log(studentList);
  return (
    <div className='container'>
      <BilgiGiris handleForm={handleForm} setIsOpen={setIsOpen} isOpen={isOpen} />
      <h1>Öğrenci Bilgi Sistemi <button className="kayitBtn" onClick={() => setIsOpen(true)}>Yeni Kayıt</button></h1>
      <div className="studentTable">
        <ul className="studentTableTitles">
          <li>Ad</li>
          <li>Soyad</li>
          <li>E-Posta Adresi</li>
          <li>Doğum Tarihi</li>
          <li>#</li>
        </ul>
        {studentList.map(x => <StudentRow key={x.id} {...x} deleteRecord={deleteRecord} updateRecord={updateRecord} />)}
      </div>
    </div>
  )
}

function BilgiGiris({ isOpen, setIsOpen, handleForm }) {
  return (
    <div className="kayitContainer"> 
      <dialog className='kayitModal' open={isOpen}>
        <div className="modalheader">
          <h1>Kayıt Ekle</h1>
          <button className='closebtn' onClick={() => setIsOpen(false)} >X</button>
        </div>
        <form className='kayitForm' onSubmit={handleForm}>
          <input required type="text" name='ad' placeholder='Adınızı Giriniz' />
          <input required type="text" name='soyad' placeholder='Soyadınızı Giriniz' />
          <input required type="number" name='yas' placeholder='Yaşınızı Giriniz' />
          <input required type="date" name='dogumTarihi' />
          <input required type='email' name='ePosta' placeholder='E-postanızı Giriniz' />
          <button type="submit">Kayıt Ekle</button>
        </form>
      </dialog>
    </div>
  )
}


function StudentRow({ id, ad, soyad, ePosta, dogumTarihi, updateRecord, deleteRecord, }) {
  const [isEditing, setEditing] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    formObj.id = id;
    updateRecord(formObj);
    setEditing(false);
  }

  return (
    <form className="studentTableform"  onSubmit={handleSubmit} onDoubleClick={() => setEditing(true)}>
      {isEditing ? (
        <>
          <div className="studentTableCol">
            <input type="text" required name='ad' defaultValue={ad} />
          </div>
          <div className="studentTableCol">
            <input type="text" required name='soyad' defaultValue={soyad} />
          </div>
          <div className="studentTableCol">
            <input type="email" required name='ePosta' defaultValue={ePosta} />
          </div>
          <div className="studentTableCol">
            <input type="date" required name='dogumTarihi' defaultValue={dogumTarihi} />
          </div>
          <div className="studentTableCol">
            <button className='cancelbtn' type='button' onClick={() => setEditing(false)}>vazgeç</button>
            <button className='saveBtn' type='submit'>kaydet</button>
          </div>
        </>)
        :
        (
          <>
            <div className="studentTableCol">{ad}</div>
            <div className="studentTableCol">{soyad}</div>
            <div className="studentTableCol">{ePosta}</div>
            <div className="studentTableCol">
              {dogumTarihi.split("-").reverse().join(".")}
            </div>
            <div className="studentTableCol">
              <button className='designbtn' type='button'  onClick={() => setEditing(true)}>düzenle</button>
              <button className='delBtn' type='button' onClick={() => deleteRecord(id)}>sil</button>
            </div>
          </>)
      }
    </form>
  )
}

export default App
