<template>
  <div class="richtext-editor" @click="showColorModal = false">
    <div v-if="editor" class="editor-toolbar btn-toolbar flex-wrap gap-1 mb-1" role="toolbar">
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().toggleBold().run()" :class="{ 'active': editor.isActive('bold') }" title="Negrita"><i class="bi bi-type-bold"></i></button>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'active': editor.isActive('italic') }" title="Cursiva"><i class="bi bi-type-italic"></i></button>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'active': editor.isActive('strike') }" title="Tachado"><i class="bi bi-type-strikethrough"></i></button>
      <div class="vr mx-1"></div>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'active': editor.isActive('heading', { level: 2 }) }" title="Título H2">H2</button>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'active': editor.isActive('heading', { level: 3 }) }" title="Título H3">H3</button>
      <div class="vr mx-1"></div>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'active': editor.isActive('bulletList') }" title="Lista"><i class="bi bi-list-ul"></i></button>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'active': editor.isActive('orderedList') }" title="Lista numerada"><i class="bi bi-list-ol"></i></button>
      <div class="vr mx-1"></div>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'active': editor.isActive({ textAlign: 'left' }) }" title="Alinear izquierda"><i class="bi bi-text-left"></i></button>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'active': editor.isActive({ textAlign: 'center' }) }" title="Centrar"><i class="bi bi-text-center"></i></button>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'active': editor.isActive({ textAlign: 'right' }) }" title="Alinear derecha"><i class="bi bi-text-right"></i></button>
      <div class="vr mx-1"></div>
      <select class="form-select form-select-sm" style="width:auto;font-size:inherit" :value="currentFontSize" @change="setFontSize($event.target.value)">
        <option value="">Tamaño</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
        <option value="36px">36px</option>
        <option value="48px">48px</option>
        <option value="64px">64px</option>
      </select>
      <div class="vr mx-1"></div>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'active': editor.isActive('blockquote') }" title="Cita"><i class="bi bi-quote"></i></button>
      <button class="btn btn-sm btn-light" @click="openLinkModal" :class="{ 'active': editor.isActive('link') }" title="Enlace"><i class="bi bi-link-45deg"></i></button>
      <button class="btn btn-sm btn-light" @click.stop="showColorModal = !showColorModal" title="Color del texto"><i class="bi bi-palette"></i></button>
      <div class="vr mx-1"></div>
      <button v-if="isImageSelected" class="btn btn-sm btn-light active" title="Imagen seleccionada"><i class="bi bi-image"></i></button>
      <button v-else class="btn btn-sm btn-light" @click="triggerImageUpload" title="Imagen"><i class="bi bi-image"></i></button>
      <button class="btn btn-sm btn-light" @click="openYoutubeModal" title="YouTube"><i class="bi bi-youtube text-danger"></i></button>
      <div class="vr mx-1"></div>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().undo().run()" title="Deshacer"><i class="bi bi-arrow-counterclockwise"></i></button>
      <button class="btn btn-sm btn-light" @click="editor.chain().focus().redo().run()" title="Rehacer"><i class="bi bi-arrow-clockwise"></i></button>
    </div>

    <editor-content :editor="editor" class="editor-content border rounded p-3" :style="{ minHeight: height }" />

    <input type="file" ref="fileInput" accept="image/*" class="d-none" @change="handleImageUpload" />

    <!-- YouTube Modal -->
    <div v-if="showYoutubeModal" class="modal-backdrop" @click.self="showYoutubeModal = false">
      <div class="modal-card p-4">
        <h6 class="fw-bold mb-3">Insertar video de YouTube</h6>
        <input v-model="youtubeUrl" class="form-control mb-3" placeholder="https://youtube.com/watch?v=..." />
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-light btn-sm" @click="showYoutubeModal = false">Cancelar</button>
          <button class="btn btn-primary btn-sm" @click="insertYoutube">Insertar</button>
        </div>
      </div>
    </div>

    <!-- Link Modal -->
    <div v-if="showLinkModal" class="modal-backdrop" @click.self="showLinkModal = false">
      <div class="modal-card p-4">
        <h6 class="fw-bold mb-3">Insertar enlace</h6>
        <input v-model="linkUrl" class="form-control mb-3" placeholder="https://..." />
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-light btn-sm" @click="showLinkModal = false">Cancelar</button>
          <button class="btn btn-primary btn-sm" @click="insertLink">Insertar</button>
        </div>
      </div>
    </div>

    <!-- Image Toolbar -->
    <div v-if="isImageSelected && editor" class="image-toolbar" @click.stop>
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <div class="d-flex align-items-center gap-1">
          <label class="small text-nowrap mb-0">Ancho:</label>
          <select class="form-select form-select-sm" style="width:90px" :value="imageWidth" @change="setImageWidth($event.target.value)">
            <option value="">Original</option>
            <option value="25%">25%</option>
            <option value="50%">50%</option>
            <option value="75%">75%</option>
            <option value="100%">100%</option>
            <option value="300px">300px</option>
            <option value="400px">400px</option>
            <option value="500px">500px</option>
          </select>
        </div>
        <div class="vr"></div>
        <div class="d-flex align-items-center gap-1">
          <label class="small text-nowrap mb-0">Alinear:</label>
          <button class="btn btn-sm" :class="imageAlign === 'left' ? 'btn-primary' : 'btn-light'" @click="setImageAlign('left')" title="Izquierda"><i class="bi bi-image"></i> <i class="bi bi-text-right"></i></button>
          <button class="btn btn-sm" :class="imageAlign === 'center' ? 'btn-primary' : 'btn-light'" @click="setImageAlign('center')" title="Centro"><i class="bi bi-image"></i></button>
          <button class="btn btn-sm" :class="imageAlign === 'right' ? 'btn-primary' : 'btn-light'" @click="setImageAlign('right')" title="Derecha"><i class="bi bi-text-left"></i> <i class="bi bi-image"></i></button>
        </div>
      </div>
    </div>

    <!-- Color Picker -->
    <div v-if="showColorModal" class="color-picker-dropdown" @click.stop>
      <div class="d-flex flex-wrap gap-1 mb-2">
        <button v-for="c in presetColors" :key="c" class="color-swatch" :style="{ background: c }" @click="setColor(c)" :title="c"></button>
      </div>
      <div class="d-flex gap-1 align-items-center">
        <input v-model="customColor" type="color" class="form-control form-control-color p-0" style="width:32px;height:30px" @input="setColor(customColor)" />
        <input v-model="customColor" class="form-control form-control-sm flex-grow-1" placeholder="#ff0000" @keyup.enter="setColor(customColor)" />
        <button class="btn btn-sm btn-outline-danger" @click="clearColor" title="Quitar color"><i class="bi bi-x"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

const CustomImage = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      'data-align': { default: null },
    }
  },
  renderHTML({ HTMLAttributes }) {
    const { 'data-align': align, ...attrs } = HTMLAttributes
    const extra = {}
    if (align === 'left') extra.style = 'float:left;margin-right:1rem'
    else if (align === 'right') extra.style = 'float:right;margin-left:1rem'
    else if (align === 'center') extra.style = 'display:block;margin:0 auto'
    return ['img', mergeAttributes(this.options.HTMLAttributes, attrs, extra)]
  },
})
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle, FontSize } from '@tiptap/extension-text-style'
import axios from 'axios'

const props = defineProps({
  modelValue: { type: String, default: '' },
  height: { type: String, default: '200px' },
  placeholder: { type: String, default: 'Escribe aquí...' },
})
const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const showYoutubeModal = ref(false)
const showLinkModal = ref(false)
const showColorModal = ref(false)
const youtubeUrl = ref('')
const linkUrl = ref('')
const customColor = ref('#ff0000')
const presetColors = ['#ff0000', '#ff6600', '#ffcc00', '#00cc00', '#0066ff', '#6600cc', '#cc0066', '#000000', '#666666', '#999999', '#cccccc', '#ffffff']

const currentFontSize = ref('')
const isImageSelected = ref(false)
const imageWidth = ref('')
const imageAlign = ref('')

const updateImageState = (editor) => {
  const imgAttrs = editor.getAttributes('image')
  if (imgAttrs.src) {
    isImageSelected.value = true
    imageWidth.value = imgAttrs.width || ''
    imageAlign.value = imgAttrs['data-align'] || ''
  } else {
    isImageSelected.value = false
    imageWidth.value = ''
    imageAlign.value = ''
  }
}

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
    CustomImage.configure({ resize: { enabled: true } }),
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: props.placeholder }),
    Youtube.configure({ width: 480, height: 320 }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle,
    FontSize,
    Color,
  ],
  onUpdate: ({ editor }) => {
    currentFontSize.value = editor.getAttributes('textStyle').fontSize || ''
    updateImageState(editor)
    emit('update:modelValue', editor.getHTML())
  },
  onSelectionUpdate: ({ editor }) => {
    currentFontSize.value = editor.getAttributes('textStyle').fontSize || ''
    updateImageState(editor)
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val || '', false)
  }
})

onBeforeUnmount(() => editor.value?.destroy())

const triggerImageUpload = () => fileInput.value?.click()

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await axios.post('/api/uploads', fd, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    const data = res.data?.data || res.data
    editor.value?.chain().focus().setImage({ src: `/uploads/${data.filename}` }).run()
  } catch (e) {
    console.error('Upload error:', e)
  }
  event.target.value = ''
}

const openYoutubeModal = () => { youtubeUrl.value = ''; showYoutubeModal.value = true }

const insertYoutube = () => {
  const m = youtubeUrl.value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (m) {
    editor.value?.chain().focus().setYoutubeVideo({ src: `https://www.youtube.com/embed/${m[1]}` }).run()
  }
  showYoutubeModal.value = false
}

const openLinkModal = () => {
  linkUrl.value = editor.value?.getAttributes('link').href || ''
  showLinkModal.value = true
}

const insertLink = () => {
  if (linkUrl.value) {
    editor.value?.chain().focus().setLink({ href: linkUrl.value }).run()
  } else {
    editor.value?.chain().focus().unsetLink().run()
  }
  showLinkModal.value = false
}

const setFontSize = (size) => {
  if (size) {
    editor.value?.chain().focus().setFontSize(size).run()
  } else {
    editor.value?.chain().focus().unsetFontSize().run()
  }
}

const setImageWidth = (width) => {
  editor.value?.chain().focus().updateAttributes('image', { width: width || null }).run()
  imageWidth.value = width
}

const setImageAlign = (align) => {
  editor.value?.chain().focus().updateAttributes('image', { 'data-align': align === imageAlign.value ? null : align }).run()
}

const setColor = (color) => {
  editor.value?.chain().focus().setColor(color).run()
  showColorModal.value = false
}

const clearColor = () => {
  editor.value?.chain().focus().unsetColor().run()
  showColorModal.value = false
}
</script>

<style scoped>
.richtext-editor { border-radius: 8px; }
.editor-toolbar { display: flex; flex-wrap: wrap; align-items: center; padding: 0.25rem; background: #f8f9fa; border: 1px solid #dee2e6; border-bottom: 0; border-radius: 8px 8px 0 0; }
.editor-toolbar .btn-light.active { background: #0d6efd; color: white; }
.editor-content { border-color: #dee2e6; border-radius: 0 0 8px 8px; cursor: text; }
.editor-content:deep(.ProseMirror) { outline: none; min-height: inherit; }
.editor-content:deep(.ProseMirror p) { margin-bottom: 0.5rem; }
.editor-content:deep(.ProseMirror img) { max-width: 100%; height: auto; border-radius: 8px; }
.editor-content:deep(.ProseMirror iframe) { max-width: 100%; border-radius: 8px; }
.editor-content:deep(.ProseMirror h2) { font-size: 1.5rem; margin-top: 1rem; margin-bottom: 0.5rem; }
.editor-content:deep(.ProseMirror h3) { font-size: 1.25rem; margin-top: 0.75rem; margin-bottom: 0.5rem; }
.editor-content:deep(.ProseMirror ul), .editor-content:deep(.ProseMirror ol) { padding-left: 1.5rem; }
.editor-content:deep(.ProseMirror blockquote) { border-left: 3px solid #0d6efd; padding-left: 1rem; color: #6c757d; }
.editor-content:deep(.ProseMirror p.is-editor-empty:first-child::before) { color: #adb5bd; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-card { background: white; border-radius: 16px; width: 90%; max-width: 440px; }
.image-toolbar { background: white; border: 1px solid #dee2e6; border-top: 0; border-radius: 0 0 8px 8px; padding: 6px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.image-toolbar .btn-sm i { font-size: 0.85rem; }
.image-toolbar .btn-sm { display: inline-flex; align-items: center; gap: 2px; }
.color-picker-dropdown { position: absolute; z-index: 2100; background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin-top: 4px; max-width: 280px; }
.color-swatch { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #e9ecef; cursor: pointer; padding: 0; }
.color-swatch:hover { border-color: #0d6efd; transform: scale(1.15); }
.editor-toolbar { position: relative; }
</style>
