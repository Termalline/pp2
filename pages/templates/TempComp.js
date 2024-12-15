import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
export const TempComp = (props) => {

    const [templateTitle, setTemplateTitle] = useState()
    const [templateDate, setTemplateDate] = useState()
    const [postId, setPostId] = useState()


    const router = useRouter()
    useEffect(() => {
         

        const params = { code_templates: 1, page: props.page_num };
  
        const options = {
          
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
          };
          const url = `/api/users/${props.id + `?`+ new URLSearchParams(params)}`
          
          const fetchData = async () => {
         
          
            const data = await fetch(url, options)
            const json = await data.json();
            if (json.next){
                props.next_page("next page")
            }
            else if (!json.next){
                props.next_page(null)
            }

            if (json.prev){
                props.prev_page("prev page")
            }
            else if (!json.prev){
                props.prev_page(null)
            }

            try { // its possible there is less than 5 posts
            if (json.posts){

                setTemplateTitle(json.posts[props.post_num].title)
                setTemplateDate(json.posts[props.post_num].createdAt)
                setPostId(json.posts[props.post_num].id)
     

            }
        } catch (err) {
                setTemplateTitle(undefined)
                setTemplateDate(undefined)
                setPostId(undefined)
               
            }


          }

          if(props.id){
          fetchData()
          }


    },[props.id, props.post_num, props.next_page, props.prev_page, props.page_num])




    if (!props.id) return (<h1>no code templates found</h1>);

    return (<div onClick={() => router.push('/templates/'+ postId)}><div>{templateTitle} </div><div>{templateDate}</div>   </div>)
}