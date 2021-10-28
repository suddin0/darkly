# <span style="text-decoration: underline">Survey</span>

- Tags : `html`, `source code`, `form` , `POST`
- Server ip : `192.168.1.23 `
- Difficulty : <span style="color : green">Easy</span>

___

## <span style="text-decoration: underline">problem</span>

When we go to the `SURVEY` tab we see the following content

> ![survey index](/.resources/images/survey_index.png)

Here we can see a table where user can select a number between 1-10 by clicking the value on a `pick list` in the **Grade** column. When we select a value from the `pick list` the page get refreshed and nothing happens. When we see the source code of the table we can see the following

```html
<table width="50%" style="margin-left: auto; margin-right: auto;">
<caption><p>Make your choice</caption><br /><br /></p>
	<tbody>
		<tr bgcolor="Gray">
			<td align="center">Grade</td>
			<td align="center">Average</td>
			<td align="center">Subject</td>
			<td align="center">Nb of vote(<em>indicative</em>)</td>
		</tr>
			<tr bgcolor="Silver">
				<td align="center">
				<form action="#" method="post">
					<input type="hidden" name="sujet" value="2">
					<SELECT name="valeur" onChange='javascript:this.form.submit();'>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
					</SELECT>
				</form>
			</td>
			<td align="center">
4214.23			</td>
			<td align="center">

Laurie			</td>
			<td align="center">
4260			</td>
		</tr>

			<tr bgcolor="Silver">
				<td align="center">
				<form action="#" method="post">
					<input type="hidden" name="sujet" value="3">
					<SELECT name="valeur" onChange='javascript:this.form.submit();'>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
					</SELECT>
				</form>
			</td>
			<td align="center">
5.23529			</td>
			<td align="center">

Mathieu			</td>
			<td align="center">
17			</td>
		</tr>

			<tr bgcolor="Silver">
				<td align="center">
				<form action="#" method="post">
					<input type="hidden" name="sujet" value="4">
					<SELECT name="valeur" onChange='javascript:this.form.submit();'>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
					</SELECT>
				</form>
			</td>
			<td align="center">
8.64707			</td>
			<td align="center">

Thor			</td>
			<td align="center">
17			</td>
		</tr>

			<tr bgcolor="Silver">
				<td align="center">
				<form action="#" method="post">
					<input type="hidden" name="sujet" value="5">
					<SELECT name="valeur" onChange='javascript:this.form.submit();'>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
					</SELECT>
				</form>
			</td>
			<td align="center">
9.1			</td>
			<td align="center">

Ly			</td>
			<td align="center">
666			</td>
		</tr>

			<tr bgcolor="Silver">
				<td align="center">
				<form action="#" method="post">
					<input type="hidden" name="sujet" value="6">
					<SELECT name="valeur" onChange='javascript:this.form.submit();'>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
					</SELECT>
				</form>
			</td>
			<td align="center">
6.969			</td>
			<td align="center">

Zaz			</td>
			<td align="center">
69			</td>
		</tr>
</table>
```

Here we can see two interesting things:

01. Each **Grade**  input is inside a form that does a `POST` request to the current page
02. When we select a value a `java script` function execute the `submit` function thus a submot request is sent.

!> The `hidden` input is not really importent for us.

## <span style="text-decoration: underline">Solution</span>

### Changing the value of the input field

Just like for the [recover](/recover?id=changing-the-value-of-the-input-field) challenge we can change the `html` `value` of one onf the `pick list` element (the list from 1-10) and select that value as our **Grade**

> ![survey modified value](/.resources/images/survey_index_modified_value.png)

And we get the following result

> ![survey flag](/.resources/images/survey_flag.png)

### Using [`Curl`](https://curl.se/)

Ofcorse the same request could be sent using `Curl` from our terminal and it would look like this

```bash
$ curl -s -d 'sujet=2&valeur=11' -X POST 'http://192.168.1.23/?page=survey'  | grep flag 
<center><h2 style="margin-top:50px;"> The flag is 03a944b434d5baff05f46c4bede5792551a2595574bcafc9a6e25f67c382ccaa</h2><br/><img src="images/win.png" alt="" width=200px height=200px></center> <div style="margin-top:-75px">
```

# <span style="text-decoration: underline">How to avoid the problem</span>

One way to avoid this problem would be a serverside checking of the data as we can control what we are sending.

# <span style="text-decoration: underline">Flag</span>

```text
03a944b434d5baff05f46c4bede5792551a2595574bcafc9a6e25f67c382ccaa
```
