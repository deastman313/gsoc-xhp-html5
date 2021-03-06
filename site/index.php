<?php
require_once '../php-lib/init.php';

function getValue($keyword, $content) {
	$r = preg_match("/".$keyword.":\s*(.+)\n/",$content,$matches);
	return $r ? $matches[1] : "";
}

echo 
<style>{'table td { padding: 5px; border: 1px solid black }
table { border-collapse: collapse; }
'}</style>;

$newElementsTable = <table/>;
$newElementsTable->appendChild(<thead>
	<tr>
		<td>Element</td>
		<td>Demo</td>
		<td>Visual?</td>
		<td>Firefox</td>
		<td>Chrome (Webkit)</td>
		<td>Opera</td>
		<td>IE</td>
		<td>simulated in XHP?</td>
	</tr>
	</thead>);
	
$files = scandir("elements");
foreach ($files as $file) {
	$parts = explode(".",$file);
	$extension = end($parts);
    $element = prev($parts);

	if ($extension == "php") {
		$content = file_get_contents('elements/'.$file); 
		$visible = getValue("VISUAL",$content);
		$chrome = getValue("CHROME",$content);
		$firefox = getValue("FIREFOX",$content);
		$opera = getValue("OPERA",$content);
		$ie = getValue("IE",$content);
		$xhp = getValue("XHP",$content);
		$showURL = "show.php?el=$element";
		$newElementsTable->appendChild(
			<tr>
				<td>&lt;{$element}&gt;</td>
				<td><a href={$showURL}>show</a></td>
				<td>{$visible}</td>
				<td>{$firefox}</td>
				<td>{$chrome}</td>
				<td>{$opera}</td>
				<td>{$ie}</td>
				<td>{$xhp}</td>
			</tr>);
	}
}

$newAttributesTable = <table/>;
$newAttributesTable->appendChild(<thead>
	<tr>
		<td>Elements</td>
		<td>Attributes</td>
		<td>Demo</td>
		<td>Visual?</td>
		<td>Firefox</td>
		<td>Chrome (Webkit)</td>
		<td>Opera</td>
		<td>IE</td>
		<td>simulated in XHP?</td>
	</tr>
	</thead>);
	
$files = scandir("attributes");
foreach ($files as $file) {
	$parts = explode(".",$file);
	$extension = end($parts);
    $element = prev($parts);
    $parts2 = explode("-",$element);
    $element = $parts2[0];
    $attribute = $parts2[1];

	if ($extension == "php") {
		$content = file_get_contents('attributes/'.$file); 
		$visible = getValue("VISUAL",$content);
		$chrome = getValue("CHROME",$content);
		$firefox = getValue("FIREFOX",$content);
		$opera = getValue("OPERA",$content);
		$ie = getValue("IE",$content);
		$xhp = getValue("XHP",$content);
		$showURL = "show.php?el=$element&attr=$attribute";
		$newAttributesTable->appendChild(
			<tr>
				<td>&lt;{$element}&gt;</td>
				<td>{$attribute}</td>
				<td><a href={$showURL}>show</a></td>
				<td>{$visible}</td>
				<td>{$firefox}</td>
				<td>{$chrome}</td>
				<td>{$opera}</td>
				<td>{$ie}</td>
				<td>{$xhp}</td>
			</tr>);
	}
}


echo <h1>HTML5 support in XHP</h1>;

echo <h2>New Elements</h2>;

echo $newElementsTable;

echo <h2>New attributes</h2>;

echo $newAttributesTable;

echo <h2>Spec</h2>;
?>
<a href="spec/HTML5 differences from HTML4.html">HTML5 differences from HTML4</a> (progress marked inside this document)<br>
<a href="http://en.wikipedia.org/wiki/Comparison_of_layout_engines_(HTML_5)">Comparison of layout engines (HTML5)</a>

<h2>Browser Versions</h2>

<p>
	Chrome: 5.0.375.99 beta<br>
	Opera 10.6
</p>