'use strict';
/**
 * Textos de la interfaz.
 *   c = portada (bloc de notas). Va EN CLARO en el archivo: solo palabras de una app de notas.
 *   r = lector. Va DENTRO del contenido cifrado: no se ve sin la clave.
 *
 * Ninguno ha pasado todavía por un hablante nativo. es y en son fiables; el resto son frases
 * cortas traducidas por IA y están PENDIENTES de revisión nativa antes de repartir nada.
 * Para añadir un idioma, copia el bloque "en" (o pásalo con --ui-archivo mi_idioma.json).
 */
module.exports = {
  es: {
    dir: 'ltr',
    c: { t: 'Notas', s: 'Buscar', e: 'No hay notas', z: 'Sin resultados', n: 'Nueva nota', d: 'Eliminar', b: 'Atrás', p: 'Escribe aquí…', f: 'notas' },
    r: {
      pv: 'Anterior', nx: 'Siguiente', f: 'Tamaño de letra', th: 'Tema', cp: 'Pasar una copia', ab: 'Acerca de', x: 'Cerrar', s: 'Buscar', m: 'Más', z: 'Sin resultados',
      k1: 'Clave nueva', k2: 'Repite la clave', fn: 'Nombre del archivo', mk: 'Crear copia', e1: 'Mínimo 8 caracteres', e2: 'Las claves no coinciden',
      h1: 'Crea una copia para otra persona. Llevará su propia clave y será distinta de la tuya. Dile la clave en persona, nunca por mensaje.',
      h2: 'Copia lista. Pásala por Bluetooth, tarjeta o cable.', sd: 'Enviar', sv: 'Guardar', ok: 'Hecho',
      hp: 'Para abrir: escribe la clave en el buscador de notas y pulsa Intro. Para cerrar: ✕, Atrás o cambia de aplicación.'
    }
  },
  en: {
    dir: 'ltr',
    c: { t: 'Notes', s: 'Search', e: 'No notes yet', z: 'No results', n: 'New note', d: 'Delete', b: 'Back', p: 'Write here…', f: 'notes' },
    r: {
      pv: 'Previous', nx: 'Next', f: 'Text size', th: 'Theme', cp: 'Pass on a copy', ab: 'About', x: 'Close', s: 'Search', m: 'More', z: 'No results',
      k1: 'New passphrase', k2: 'Repeat the passphrase', fn: 'File name', mk: 'Make copy', e1: 'At least 8 characters', e2: 'The passphrases do not match',
      h1: 'Make a copy for someone else. It gets its own passphrase and is different from yours. Tell them the passphrase in person, never in a message.',
      h2: 'Copy ready. Pass it on by Bluetooth, card or cable.', sd: 'Send', sv: 'Save', ok: 'Done',
      hp: 'To open: type the passphrase in the notes search box and press Enter. To close: ✕, Back, or switch apps.'
    }
  },
  fr: {
    dir: 'ltr',
    c: { t: 'Notes', s: 'Rechercher', e: 'Aucune note', z: 'Aucun résultat', n: 'Nouvelle note', d: 'Supprimer', b: 'Retour', p: 'Écrivez ici…', f: 'notes' },
    r: {
      pv: 'Précédent', nx: 'Suivant', f: 'Taille du texte', th: 'Thème', cp: 'Donner une copie', ab: 'À propos', x: 'Fermer', s: 'Rechercher', m: 'Plus', z: 'Aucun résultat',
      k1: 'Nouvelle phrase secrète', k2: 'Répétez la phrase secrète', fn: 'Nom du fichier', mk: 'Créer la copie', e1: '8 caractères minimum', e2: 'Les deux phrases ne correspondent pas',
      h1: 'Créez une copie pour quelqu’un d’autre. Elle aura sa propre phrase secrète et sera différente de la vôtre. Donnez la phrase de vive voix, jamais par message.',
      h2: 'Copie prête. Transmettez-la par Bluetooth, carte ou câble.', sd: 'Envoyer', sv: 'Enregistrer', ok: 'Terminé',
      hp: 'Pour ouvrir : tapez la phrase secrète dans la recherche des notes, puis Entrée. Pour fermer : ✕, Retour, ou changez d’application.'
    }
  },
  pt: {
    dir: 'ltr',
    c: { t: 'Notas', s: 'Buscar', e: 'Nenhuma nota', z: 'Nenhum resultado', n: 'Nova nota', d: 'Excluir', b: 'Voltar', p: 'Escreva aqui…', f: 'notas' },
    r: {
      pv: 'Anterior', nx: 'Próximo', f: 'Tamanho da letra', th: 'Tema', cp: 'Passar uma cópia', ab: 'Sobre', x: 'Fechar', s: 'Buscar', m: 'Mais', z: 'Nenhum resultado',
      k1: 'Nova senha', k2: 'Repita a senha', fn: 'Nome do arquivo', mk: 'Criar cópia', e1: 'Mínimo de 8 caracteres', e2: 'As senhas não coincidem',
      h1: 'Crie uma cópia para outra pessoa. Ela terá a própria senha e será diferente da sua. Diga a senha pessoalmente, nunca por mensagem.',
      h2: 'Cópia pronta. Passe por Bluetooth, cartão ou cabo.', sd: 'Enviar', sv: 'Salvar', ok: 'Concluído',
      hp: 'Para abrir: digite a senha na busca das notas e pressione Enter. Para fechar: ✕, Voltar ou troque de aplicativo.'
    }
  },
  ru: {
    dir: 'ltr',
    c: { t: 'Заметки', s: 'Поиск', e: 'Заметок нет', z: 'Ничего не найдено', n: 'Новая заметка', d: 'Удалить', b: 'Назад', p: 'Пишите здесь…', f: 'заметки' },
    r: {
      pv: 'Назад', nx: 'Вперёд', f: 'Размер шрифта', th: 'Тема', cp: 'Передать копию', ab: 'О тексте', x: 'Закрыть', s: 'Поиск', m: 'Ещё', z: 'Ничего не найдено',
      k1: 'Новый пароль', k2: 'Повторите пароль', fn: 'Имя файла', mk: 'Создать копию', e1: 'Не менее 8 символов', e2: 'Пароли не совпадают',
      h1: 'Создайте копию для другого человека. У неё будет свой пароль, и она будет отличаться от вашей. Сообщите пароль лично, не в сообщении.',
      h2: 'Копия готова. Передайте её по Bluetooth, на карте памяти или по кабелю.', sd: 'Отправить', sv: 'Сохранить', ok: 'Готово',
      hp: 'Чтобы открыть: введите пароль в поиске по заметкам и нажмите Enter. Чтобы закрыть: ✕, «Назад» или переключитесь на другое приложение.'
    }
  },
  ar: {
    dir: 'rtl',
    c: { t: 'ملاحظات', s: 'بحث', e: 'لا توجد ملاحظات', z: 'لا توجد نتائج', n: 'ملاحظة جديدة', d: 'حذف', b: 'رجوع', p: 'اكتب هنا…', f: 'ملاحظات' },
    r: {
      pv: 'السابق', nx: 'التالي', f: 'حجم الخط', th: 'المظهر', cp: 'إعطاء نسخة', ab: 'حول', x: 'إغلاق', s: 'بحث', m: 'المزيد', z: 'لا توجد نتائج',
      k1: 'كلمة سر جديدة', k2: 'أعد كتابة كلمة السر', fn: 'اسم الملف', mk: 'إنشاء النسخة', e1: '٨ أحرف على الأقل', e2: 'كلمتا السر غير متطابقتين',
      h1: 'أنشئ نسخة لشخص آخر. ستكون لها كلمة سر خاصة بها وتختلف عن نسختك. أخبره بكلمة السر وجهًا لوجه، لا في رسالة.',
      h2: 'النسخة جاهزة. أعطها عبر البلوتوث أو بطاقة الذاكرة أو الكابل.', sd: 'إرسال', sv: 'حفظ', ok: 'تم',
      hp: 'للفتح: اكتب كلمة السر في خانة البحث في الملاحظات ثم اضغط إدخال. للإغلاق: ✕ أو رجوع أو انتقل إلى تطبيق آخر.'
    }
  },
  fa: {
    dir: 'rtl',
    c: { t: 'یادداشت‌ها', s: 'جستجو', e: 'یادداشتی وجود ندارد', z: 'نتیجه‌ای پیدا نشد', n: 'یادداشت جدید', d: 'حذف', b: 'بازگشت', p: 'اینجا بنویسید…', f: 'یادداشت' },
    r: {
      pv: 'قبلی', nx: 'بعدی', f: 'اندازهٔ قلم', th: 'پوسته', cp: 'دادن یک نسخه', ab: 'درباره', x: 'بستن', s: 'جستجو', m: 'بیشتر', z: 'نتیجه‌ای پیدا نشد',
      k1: 'رمز جدید', k2: 'تکرار رمز', fn: 'نام فایل', mk: 'ساخت نسخه', e1: 'دست‌کم ۸ نویسه', e2: 'رمزها یکسان نیستند',
      h1: 'برای شخص دیگری یک نسخه بسازید. آن نسخه رمز خودش را دارد و با نسخهٔ شما فرق می‌کند. رمز را حضوری بگویید، نه در پیام.',
      h2: 'نسخه آماده است. آن را با بلوتوث، کارت حافظه یا کابل بدهید.', sd: 'ارسال', sv: 'ذخیره', ok: 'انجام شد',
      hp: 'برای باز کردن: رمز را در جستجوی یادداشت‌ها بنویسید و Enter را بزنید. برای بستن: ✕، بازگشت، یا به برنامهٔ دیگری بروید.'
    }
  },
  zh: {
    dir: 'ltr',
    c: { t: '备忘录', s: '搜索', e: '没有备忘录', z: '没有结果', n: '新建', d: '删除', b: '返回', p: '在此输入…', f: '备忘录' },
    r: {
      pv: '上一章', nx: '下一章', f: '字号', th: '主题', cp: '给别人一份', ab: '关于', x: '关闭', s: '搜索', m: '更多', z: '没有结果',
      k1: '新密码', k2: '再输入一次', fn: '文件名', mk: '生成副本', e1: '至少 8 个字符', e2: '两次输入不一致',
      h1: '为别人生成一份副本。它有自己的密码，和你的这份不同。请当面告诉对方密码，不要用消息发送。',
      h2: '副本已生成。请通过蓝牙、存储卡或数据线传给对方。', sd: '发送', sv: '保存', ok: '完成',
      hp: '打开：在备忘录的搜索框输入密码并按回车。关闭：点 ✕、按返回键，或切换到其他应用。'
    }
  },
  id: {
    dir: 'ltr',
    c: { t: 'Catatan', s: 'Cari', e: 'Belum ada catatan', z: 'Tidak ada hasil', n: 'Catatan baru', d: 'Hapus', b: 'Kembali', p: 'Tulis di sini…', f: 'catatan' },
    r: {
      pv: 'Sebelumnya', nx: 'Berikutnya', f: 'Ukuran huruf', th: 'Tema', cp: 'Berikan salinan', ab: 'Tentang', x: 'Tutup', s: 'Cari', m: 'Lainnya', z: 'Tidak ada hasil',
      k1: 'Kata sandi baru', k2: 'Ulangi kata sandi', fn: 'Nama berkas', mk: 'Buat salinan', e1: 'Minimal 8 karakter', e2: 'Kata sandi tidak sama',
      h1: 'Buat salinan untuk orang lain. Salinan itu punya kata sandi sendiri dan berbeda dari milik Anda. Sampaikan kata sandinya secara langsung, jangan lewat pesan.',
      h2: 'Salinan siap. Berikan lewat Bluetooth, kartu memori, atau kabel.', sd: 'Kirim', sv: 'Simpan', ok: 'Selesai',
      hp: 'Untuk membuka: ketik kata sandi di kotak pencarian catatan lalu tekan Enter. Untuk menutup: ✕, Kembali, atau pindah ke aplikasi lain.'
    }
  },
  tr: {
    dir: 'ltr',
    c: { t: 'Notlar', s: 'Ara', e: 'Not yok', z: 'Sonuç yok', n: 'Yeni not', d: 'Sil', b: 'Geri', p: 'Buraya yazın…', f: 'notlar' },
    r: {
      pv: 'Önceki', nx: 'Sonraki', f: 'Yazı boyutu', th: 'Tema', cp: 'Kopya ver', ab: 'Hakkında', x: 'Kapat', s: 'Ara', m: 'Diğer', z: 'Sonuç yok',
      k1: 'Yeni parola', k2: 'Parolayı tekrarlayın', fn: 'Dosya adı', mk: 'Kopya oluştur', e1: 'En az 8 karakter', e2: 'Parolalar eşleşmiyor',
      h1: 'Başka biri için bir kopya oluşturun. Kopyanın kendi parolası olur ve sizinkinden farklıdır. Parolayı yüz yüze söyleyin, mesajla göndermeyin.',
      h2: 'Kopya hazır. Bluetooth, hafıza kartı veya kabloyla verin.', sd: 'Gönder', sv: 'Kaydet', ok: 'Tamam',
      hp: 'Açmak için: parolayı notlardaki arama kutusuna yazıp Enter’a basın. Kapatmak için: ✕, Geri veya başka bir uygulamaya geçin.'
    }
  },
  hi: {
    dir: 'ltr',
    c: { t: 'नोट्स', s: 'खोजें', e: 'कोई नोट नहीं है', z: 'कोई परिणाम नहीं मिला', n: 'नया नोट', d: 'हटाएँ', b: 'वापस', p: 'यहाँ लिखें…', f: 'नोट्स' },
    r: {
      pv: 'पिछला', nx: 'अगला', f: 'अक्षरों का आकार', th: 'थीम', cp: 'एक प्रति दें', ab: 'जानकारी', x: 'बंद करें', s: 'खोजें', m: 'और', z: 'कोई परिणाम नहीं मिला',
      k1: 'नया पासवर्ड', k2: 'पासवर्ड दोबारा लिखें', fn: 'फ़ाइल का नाम', mk: 'प्रति बनाएँ', e1: 'कम से कम 8 अक्षर', e2: 'दोनों पासवर्ड एक जैसे नहीं हैं',
      h1: 'किसी और के लिए एक प्रति बनाएँ। उसका अपना पासवर्ड होगा और वह आपकी प्रति से अलग होगी। पासवर्ड आमने-सामने बताएँ, संदेश में न भेजें।',
      h2: 'प्रति तैयार है। इसे ब्लूटूथ, मेमोरी कार्ड या केबल से दें।', sd: 'भेजें', sv: 'सहेजें', ok: 'हो गया',
      hp: 'खोलने के लिए: नोट्स के खोज बॉक्स में पासवर्ड लिखें और Enter दबाएँ। बंद करने के लिए: ✕, वापस, या किसी दूसरे ऐप पर जाएँ।'
    }
  },
  ko: {
    dir: 'ltr',
    c: { t: '메모', s: '검색', e: '메모가 없습니다', z: '결과 없음', n: '새 메모', d: '삭제', b: '뒤로', p: '여기에 입력…', f: '메모' },
    r: {
      pv: '이전', nx: '다음', f: '글자 크기', th: '테마', cp: '사본 전달', ab: '정보', x: '닫기', s: '검색', m: '더보기', z: '결과 없음',
      k1: '새 암호', k2: '암호 다시 입력', fn: '파일 이름', mk: '사본 만들기', e1: '8자 이상 입력하세요', e2: '암호가 일치하지 않습니다',
      h1: '다른 사람에게 줄 사본을 만듭니다. 사본은 자체 암호를 가지며 내 파일과 다릅니다. 암호는 메시지로 보내지 말고 직접 만나서 알려 주세요.',
      h2: '사본이 준비되었습니다. 블루투스, 메모리 카드 또는 케이블로 전달하세요.', sd: '보내기', sv: '저장', ok: '완료',
      hp: '열기: 메모 검색창에 암호를 입력하고 Enter를 누르세요. 닫기: ✕, 뒤로, 또는 다른 앱으로 전환하세요.'
    }
  }
};
